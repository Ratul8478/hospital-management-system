package com.hms.doctor.data.remote.api

import com.hms.doctor.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface AuthApi {
    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequestDto
    ): Response<ApiResponseDto<LoginResponseDataDto>>

    @POST("auth/logout")
    suspend fun logout(): Response<ApiResponseDto<Any>>
}

interface AppointmentApi {
    @GET("doctor/appointments/today")
    suspend fun getTodayAppointments(
        @Query("doctorId") doctorId: Int? = null,
        @Query("branchId") branchId: Int? = null,
        @Query("status") status: String? = null
    ): Response<ApiResponseDto<TodayAppointmentsResponseDto>>

    @PATCH("doctor/appointments/{id}/status")
    suspend fun updateAppointmentStatus(
        @Path("id") appointmentId: Int,
        @Body request: UpdateAppointmentStatusRequestDto
    ): Response<ApiResponseDto<AppointmentDto>>

    @POST("doctor/appointments/today")
    suspend fun createAppointment(
        @Body request: Map<String, Any>
    ): Response<ApiResponseDto<AppointmentDto>>
}

interface PatientApi {
    @GET("patients")
    suspend fun searchPatients(
        @Query("query") query: String? = null,
        @Query("branchId") branchId: Int? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<ApiResponseDto<PatientSearchResultDto>>

    @GET("patients/{id}/history")
    suspend fun getPatientHistory(
        @Path("id") patientIdOrUhid: String
    ): Response<ApiResponseDto<PatientHistoryDto>>
}

interface PrescriptionApi {
    @GET("doctor/prescriptions")
    suspend fun getPrescriptions(
        @Query("doctorId") doctorId: Int? = null,
        @Query("patientId") patientId: Int? = null,
        @Query("uhid") uhid: String? = null,
        @Query("search") search: String? = null
    ): Response<ApiResponseDto<List<PrescriptionDto>>>

    @POST("doctor/prescriptions")
    suspend fun createPrescription(
        @Body request: CreatePrescriptionRequestDto
    ): Response<ApiResponseDto<PrescriptionDto>>
}

interface ReportApi {
    @GET("doctor/reports")
    suspend fun getReports(
        @Query("doctorId") doctorId: Int? = null,
        @Query("patientId") patientId: Int? = null,
        @Query("uhid") uhid: String? = null,
        @Query("category") category: String? = null,
        @Query("status") status: String? = null
    ): Response<ApiResponseDto<ReportsResponseDto>>
}

interface AdmissionApi {
    @GET("doctor/admissions")
    suspend fun getAdmissions(
        @Query("doctorId") doctorId: Int? = null,
        @Query("branchId") branchId: Int? = null,
        @Query("wardType") wardType: String? = null
    ): Response<ApiResponseDto<AdmissionsResponseDto>>
}

interface FollowUpApi {
    @GET("doctor/followups")
    suspend fun getFollowUps(
        @Query("doctorId") doctorId: Int? = null,
        @Query("date") date: String? = null,
        @Query("status") status: String? = null
    ): Response<ApiResponseDto<FollowUpsResponseDto>>
}

interface EarningsApi {
    @GET("doctor/earnings")
    suspend fun getEarnings(
        @Query("doctorId") doctorId: Int? = null
    ): Response<ApiResponseDto<DoctorEarningsDto>>
}

interface NotificationApi {
    @POST("notifications/fcm-token")
    suspend fun registerFcmToken(
        @Body request: FcmTokenRequestDto
    ): Response<ApiResponseDto<Any>>
}
