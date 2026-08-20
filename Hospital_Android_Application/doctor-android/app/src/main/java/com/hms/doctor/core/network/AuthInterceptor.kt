package com.hms.doctor.core.network

import com.hms.doctor.core.auth.SessionManager
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthInterceptor @Inject constructor(
    private val sessionManager: SessionManager
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val builder = originalRequest.newBuilder()
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .header("X-Client-Platform", "android-doctor")
            .header("X-Client-Version", "2.0.0")

        val doctorId = sessionManager.getDoctorId()
        if (doctorId > 0) {
            builder.header("X-Doctor-Id", doctorId.toString())
        }
        val branchId = sessionManager.getBranchId()
        if (branchId > 0) {
            builder.header("X-Branch-Id", branchId.toString())
        }

        val token = sessionManager.getToken()
        if (!token.isNullOrBlank()) {
            builder.header("Authorization", "Bearer $token")
        }

        val response = chain.proceed(builder.build())

        // Auto-logout on 401 Unauthorized
        if (response.code == 401) {
            sessionManager.clearSession()
        }

        return response
    }
}
