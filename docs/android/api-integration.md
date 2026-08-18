# Medix Doctor Android: API Integration & Network Architecture

**Network Stack:** Retrofit 2.11.0 + OkHttp 4.12.0 + Gson 2.11.0 + Kotlin Coroutines  
**Security Standard:** TLS 1.3, Encrypted Token Storage, Mutual Token Refresh Interceptor  
**Target Module:** `android-doctor` (`com.medix.doctor.data.remote`)  

---

## 1. Network Stack Overview

The network integration layer manages all asynchronous HTTP/HTTPS communication between the Medix Doctor Android client and the Medix Cloud API endpoints.

```
       ┌──────────────────────────────────────────────────────────┐
       │                Domain Use Case / Repository              │
       └─────────────────────────────┬────────────────────────────┘
                                     │
       ┌─────────────────────────────▼────────────────────────────┐
       │                Retrofit 2 API Interfaces                 │
       │    AuthApiService • DoctorApiService • PatientApiService  │
       └─────────────────────────────┬────────────────────────────┘
                                     │
       ┌─────────────────────────────▼────────────────────────────┐
       │                     OkHttp 3 Client                      │
       │  ┌────────────────────────────────────────────────────┐  │
       │  │ AuthInterceptor (Injects Bearer Token & Branch ID) │  │
       │  ├────────────────────────────────────────────────────┤  │
       │  │ TokenAuthenticator (Handles 401 Atomic Refresh)    │  │
       │  ├────────────────────────────────────────────────────┤  │
       │  │ HttpLoggingInterceptor (Debug payloads / redacted) │  │
       │  ├────────────────────────────────────────────────────┤  │
       │  │ CacheInterceptor (Offline ETag & Cache-Control)    │  │
       │  └────────────────────────────────────────────────────┘  │
       └─────────────────────────────┬────────────────────────────┘
                                     │ TLS 1.3 / HTTPS
       ┌─────────────────────────────▼────────────────────────────┐
       │        Medix Production / Staging Cloud Endpoint         │
       └──────────────────────────────────────────────────────────┘
```

---

## 2. Dependency Injection Network Module (Hilt)

```kotlin
package com.medix.doctor.di

import android.content.Context
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.medix.doctor.data.remote.interceptor.AuthInterceptor
import com.medix.doctor.data.remote.interceptor.TokenAuthenticator
import com.medix.doctor.data.remote.service.AuthApiService
import com.medix.doctor.data.remote.service.DoctorApiService
import com.medix.doctor.data.remote.service.PatientApiService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.Cache
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    private const val BASE_URL = "https://hospital-management-system-using-an.vercel.app/api/v1/"
    private const val CACHE_SIZE = 50L * 1024 * 1024 // 50 MB Cache

    @Provides
    @Singleton
    fun provideGson(): Gson = GsonBuilder()
        .setDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
        .create()

    @Provides
    @Singleton
    fun provideOkHttpClient(
        @ApplicationContext context: Context,
        authInterceptor: AuthInterceptor,
        tokenAuthenticator: TokenAuthenticator
    ): OkHttpClient {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val cacheDir = File(context.cacheDir, "http_cache")
        val cache = Cache(cacheDir, CACHE_SIZE)

        return OkHttpClient.Builder()
            .cache(cache)
            .addInterceptor(authInterceptor)
            .authenticator(tokenAuthenticator)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient, gson: Gson): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }

    @Provides
    @Singleton
    fun provideAuthApiService(retrofit: Retrofit): AuthApiService =
        retrofit.create(AuthApiService::class.java)

    @Provides
    @Singleton
    fun provideDoctorApiService(retrofit: Retrofit): DoctorApiService =
        retrofit.create(DoctorApiService::class.java)

    @Provides
    @Singleton
    fun providePatientApiService(retrofit: Retrofit): PatientApiService =
        retrofit.create(PatientApiService::class.java)
}
```

---

## 3. Authentication Interceptor & Token Refresh Mechanism

### 3.1 AuthInterceptor: Attaching Headers
The `AuthInterceptor` attaches the active JWT access token, selected hospital branch ID, and client platform identity to every outgoing HTTP request.

```kotlin
package com.medix.doctor.data.remote.interceptor

import com.medix.doctor.data.local.datastore.UserSessionDataStore
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthInterceptor @Inject constructor(
    private val sessionDataStore: UserSessionDataStore
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()

        // Bypass auth headers for public authentication endpoints
        val path = originalRequest.url.encodedPath
        if (path.contains("/auth/login") || path.contains("/auth/refresh")) {
            return chain.proceed(originalRequest)
        }

        val session = runBlocking { sessionDataStore.sessionFlow.firstOrNull() }
        val token = session?.accessToken
        val branchId = session?.branchId ?: 1L

        val requestBuilder = originalRequest.newBuilder()
            .header("X-Client-Platform", "android-doctor")
            .header("X-Client-Version", "1.0.0")
            .header("X-Branch-ID", branchId.toString())

        if (!token.isNullOrBlank()) {
            requestBuilder.header("Authorization", "Bearer $token")
        }

        return chain.proceed(requestBuilder.build())
    }
}
```

---

### 3.2 TokenAuthenticator: Handling 401 Unauthorized via Mutex
When an access token expires, the server returns HTTP `401 Unauthorized`. The `TokenAuthenticator` intercepts this response, pauses concurrent outgoing calls with a coroutine `Mutex`, requests a fresh access token using the stored refresh token, updates the session store, and retries the original request seamlessly.

```kotlin
package com.medix.doctor.data.remote.interceptor

import com.medix.doctor.data.local.datastore.UserSessionDataStore
import com.medix.doctor.data.remote.dto.RefreshTokenRequestDto
import com.medix.doctor.data.remote.service.AuthApiService
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route
import javax.inject.Inject
import javax.inject.Provider
import javax.inject.Singleton

@Singleton
class TokenAuthenticator @Inject constructor(
    private val sessionDataStore: UserSessionDataStore,
    private val authApiServiceProvider: Provider<AuthApiService>
) : Authenticator {

    private val mutex = Mutex()

    override fun authenticate(route: Route?, response: Response): Request? {
        // Prevent infinite loops if refresh endpoint itself returns 401
        if (response.request.url.encodedPath.contains("/auth/refresh")) {
            return null
        }

        return runBlocking {
            mutex.withLock {
                val currentSession = sessionDataStore.sessionFlow.firstOrNull()
                val currentToken = currentSession?.accessToken

                // If another thread already refreshed the token, retry with updated token
                val authHeader = response.request.header("Authorization")
                if (authHeader != null && authHeader != "Bearer $currentToken") {
                    return@withLock response.request.newBuilder()
                        .header("Authorization", "Bearer $currentToken")
                        .build()
                }

                val refreshToken = currentSession?.refreshToken ?: return@withLock null

                try {
                    val authApi = authApiServiceProvider.get()
                    val refreshResponse = authApi.refreshToken(RefreshTokenRequestDto(refreshToken))

                    if (refreshResponse.isSuccessful && refreshResponse.body()?.data != null) {
                        val newTokens = refreshResponse.body()!!.data
                        sessionDataStore.updateTokens(
                            accessToken = newTokens.accessToken,
                            refreshToken = newTokens.refreshToken
                        )

                        return@withLock response.request.newBuilder()
                            .header("Authorization", "Bearer ${newTokens.accessToken}")
                            .build()
                    } else {
                        // Refresh token expired or revoked - trigger force logout
                        sessionDataStore.clearSession()
                        null
                    }
                } catch (e: Exception) {
                    sessionDataStore.clearSession()
                    null
                }
            }
        }
    }
}
```

---

## 4. Retrofit Service Contracts

### 4.1 DoctorApiService
```kotlin
package com.medix.doctor.data.remote.service

import com.medix.doctor.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface DoctorApiService {

    @GET("doctor/profile")
    suspend fun getDoctorProfile(): Response<ApiResponse<DoctorDto>>

    @PATCH("doctor/status")
    suspend fun updateDutyStatus(
        @Body request: UpdateDutyStatusRequestDto
    ): Response<ApiResponse<DoctorDutyStatusResponseDto>>

    @GET("doctor/appointments")
    suspend fun getAppointments(
        @Query("date") date: String?,
        @Query("status") status: String?,
        @Query("type") type: String?,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<PaginatedResponse<AppointmentDto>>

    @PATCH("doctor/appointments/{id}/status")
    suspend fun updateAppointmentStatus(
        @Path("id") id: Long,
        @Body request: UpdateAppointmentStatusRequestDto
    ): Response<ApiResponse<AppointmentDto>>

    @POST("doctor/appointments/{id}/call")
    suspend fun callPatient(
        @Path("id") id: Long
    ): Response<ApiResponse<CallPatientResponseDto>>

    @POST("doctor/prescriptions")
    suspend fun createPrescription(
        @Header("X-Idempotency-Key") idempotencyKey: String,
        @Body request: CreatePrescriptionRequestDto
    ): Response<ApiResponse<PrescriptionResponseDto>>

    @POST("doctor/device-token")
    suspend fun registerDeviceToken(
        @Body request: RegisterDeviceTokenRequestDto
    ): Response<ApiResponse<Unit>>
}
```

### 4.2 PatientApiService
```kotlin
package com.medix.doctor.data.remote.service

import com.medix.doctor.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface PatientApiService {

    @GET("patients")
    suspend fun searchPatients(
        @Query("query") query: String,
        @Query("branchId") branchId: Long?
    ): Response<ApiResponse<List<PatientSummaryDto>>>

    @GET("patients/{uhid}")
    suspend fun getPatientByUhid(
        @Path("uhid") uhid: String
    ): Response<ApiResponse<PatientDetailDto>>

    @GET("patients/{uhid}/timeline")
    suspend fun getPatientTimeline(
        @Path("uhid") uhid: String
    ): Response<ApiResponse<List<MedicalTimelineEventDto>>>

    @POST("patients/{uhid}/vitals")
    suspend fun recordVitals(
        @Path("uhid") uhid: String,
        @Header("X-Idempotency-Key") idempotencyKey: String,
        @Body vitals: VitalSignDto
    ): Response<ApiResponse<VitalSignDto>>
}
```

---

## 5. Domain Resource & Error Handling Engine

The app unifies all network responses and local exceptions into a structured `Resource<T>` sealed class:

```kotlin
package com.medix.doctor.domain.util

sealed class Resource<T>(
    val data: T? = null,
    val message: String? = null,
    val errorCode: String? = null
) {
    class Success<T>(data: T) : Resource<T>(data)
    class Error<T>(message: String, data: T? = null, errorCode: String? = null) : Resource<T>(data, message, errorCode)
    class Loading<T>(data: T? = null) : Resource<T>(data)
}
```

### Safe API Call Wrapper:
```kotlin
suspend fun <T, R> safeApiCall(
    apiCall: suspend () -> retrofit2.Response<ApiResponse<T>>,
    transform: (T) -> R
): Resource<R> {
    return try {
        val response = apiCall()
        val body = response.body()

        if (response.isSuccessful && body != null && body.success && body.data != null) {
            Resource.Success(transform(body.data))
        } else {
            val errorMessage = body?.message ?: "Server returned error code ${response.code()}"
            Resource.Error(errorMessage)
        }
    } catch (e: java.net.UnknownHostException) {
        Resource.Error("No internet connection. Please verify your Wi-Fi or mobile network.")
    } catch (e: java.net.SocketTimeoutException) {
        Resource.Error("Connection timed out. Hospital server took too long to respond.")
    } catch (e: Exception) {
        Resource.Error(e.localizedMessage ?: "An unexpected error occurred.")
    }
}
```
