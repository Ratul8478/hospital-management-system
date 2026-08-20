package com.hms.doctor.di

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.hms.doctor.BuildConfig
import com.hms.doctor.core.network.AuthInterceptor
import com.hms.doctor.data.remote.api.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideGson(): Gson {
        return GsonBuilder()
            .setLenient()
            .create()
    }

    @Provides
    @Singleton
    fun provideLoggingInterceptor(): HttpLoggingInterceptor {
        return HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor,
        loggingInterceptor: HttpLoggingInterceptor
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(
        okHttpClient: OkHttpClient,
        gson: Gson
    ): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }

    @Provides
    @Singleton
    fun provideAuthApi(retrofit: Retrofit): AuthApi = retrofit.create(AuthApi::class.java)

    @Provides
    @Singleton
    fun provideAppointmentApi(retrofit: Retrofit): AppointmentApi = retrofit.create(AppointmentApi::class.java)

    @Provides
    @Singleton
    fun providePatientApi(retrofit: Retrofit): PatientApi = retrofit.create(PatientApi::class.java)

    @Provides
    @Singleton
    fun providePrescriptionApi(retrofit: Retrofit): PrescriptionApi = retrofit.create(PrescriptionApi::class.java)

    @Provides
    @Singleton
    fun provideReportApi(retrofit: Retrofit): ReportApi = retrofit.create(ReportApi::class.java)

    @Provides
    @Singleton
    fun provideAdmissionApi(retrofit: Retrofit): AdmissionApi = retrofit.create(AdmissionApi::class.java)

    @Provides
    @Singleton
    fun provideFollowUpApi(retrofit: Retrofit): FollowUpApi = retrofit.create(FollowUpApi::class.java)

    @Provides
    @Singleton
    fun provideEarningsApi(retrofit: Retrofit): EarningsApi = retrofit.create(EarningsApi::class.java)

    @Provides
    @Singleton
    fun provideNotificationApi(retrofit: Retrofit): NotificationApi = retrofit.create(NotificationApi::class.java)
}
