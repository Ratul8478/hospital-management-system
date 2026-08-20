package com.hms.doctor.data.remote.dto

import com.google.gson.annotations.SerializedName

data class ReportsResponseDto(
    @SerializedName("summary") val summary: ReportsSummaryDto? = null,
    @SerializedName("reports") val reports: List<ReportDto> = emptyList()
)

data class ReportsSummaryDto(
    @SerializedName("total") val total: Int = 0,
    @SerializedName("ready") val ready: Int = 0,
    @SerializedName("pending") val pending: Int = 0,
    @SerializedName("criticalAlerts") val criticalAlerts: Int = 0
)

data class ReportDto(
    @SerializedName("id") val id: Int,
    @SerializedName("patientId") val patientId: Int,
    @SerializedName("uhid") val uhid: String,
    @SerializedName("patientName") val patientName: String,
    @SerializedName("doctorId") val doctorId: Int? = null,
    @SerializedName("doctorName") val doctorName: String? = null,
    @SerializedName("testName") val testName: String,
    @SerializedName("category") val category: String = "Pathology",
    @SerializedName("status") val status: String = "pending", // ready, pending, processing
    @SerializedName("resultSummary") val resultSummary: String? = null,
    @SerializedName("criticalAlert") val criticalAlert: Boolean = false,
    @SerializedName("criticalDetails") val criticalDetails: String? = null,
    @SerializedName("sampleCollectedAt") val sampleCollectedAt: String? = null,
    @SerializedName("reportedAt") val reportedAt: String? = null,
    @SerializedName("fileUrl") val fileUrl: String? = null
)

data class AdmissionsResponseDto(
    @SerializedName("activeInpatientsCount") val activeInpatientsCount: Int = 0,
    @SerializedName("breakdown") val breakdown: WardBreakdownDto? = null,
    @SerializedName("admissions") val admissions: List<AdmissionDto> = emptyList()
)

data class WardBreakdownDto(
    @SerializedName("icu") val icu: Int = 0,
    @SerializedName("private") val privateWard: Int = 0,
    @SerializedName("general") val general: Int = 0
)

data class AdmissionDto(
    @SerializedName("id") val id: Int,
    @SerializedName("patientId") val patientId: Int,
    @SerializedName("uhid") val uhid: String,
    @SerializedName("patientName") val patientName: String,
    @SerializedName("patientAge") val patientAge: Int = 0,
    @SerializedName("patientGender") val patientGender: String? = null,
    @SerializedName("doctorId") val doctorId: Int,
    @SerializedName("doctorName") val doctorName: String? = null,
    @SerializedName("branchId") val branchId: Int = 1,
    @SerializedName("branchName") val branchName: String? = null,
    @SerializedName("wardType") val wardType: String, // icu, private, general
    @SerializedName("roomNumber") val roomNumber: String,
    @SerializedName("bedNumber") val bedNumber: String,
    @SerializedName("admissionDate") val admissionDate: String,
    @SerializedName("diagnosis") val diagnosis: String,
    @SerializedName("status") val status: String = "admitted", // admitted, discharged, transferred
    @SerializedName("nursingNotes") val nursingNotes: String? = null,
    @SerializedName("currentCondition") val currentCondition: String? = null,
    @SerializedName("attendingNurse") val attendingNurse: String? = null
)

data class FollowUpsResponseDto(
    @SerializedName("totalCount") val totalCount: Int = 0,
    @SerializedName("dueTodayCount") val dueTodayCount: Int = 0,
    @SerializedName("followups") val followups: List<FollowUpDto> = emptyList()
)

data class FollowUpDto(
    @SerializedName("id") val id: Int,
    @SerializedName("patientId") val patientId: Int,
    @SerializedName("uhid") val uhid: String,
    @SerializedName("patientName") val patientName: String,
    @SerializedName("patientPhone") val patientPhone: String? = null,
    @SerializedName("doctorId") val doctorId: Int,
    @SerializedName("doctorName") val doctorName: String? = null,
    @SerializedName("scheduledDate") val scheduledDate: String,
    @SerializedName("reason") val reason: String,
    @SerializedName("status") val status: String = "pending", // pending, completed, cancelled
    @SerializedName("notes") val notes: String? = null
)

data class DoctorEarningsDto(
    @SerializedName("doctorId") val doctorId: Int,
    @SerializedName("doctorName") val doctorName: String,
    @SerializedName("specialty") val specialty: String? = null,
    @SerializedName("fee") val fee: Double = 0.0,
    @SerializedName("todayConsultations") val todayConsultations: Int = 0,
    @SerializedName("todayEarnings") val todayEarnings: Double = 0.0,
    @SerializedName("monthConsultations") val monthConsultations: Int = 0,
    @SerializedName("monthEarnings") val monthEarnings: Double = 0.0,
    @SerializedName("totalConsultations") val totalConsultations: Int = 0,
    @SerializedName("totalEarnings") val totalEarnings: Double = 0.0,
    @SerializedName("pendingPayout") val pendingPayout: Double = 0.0,
    @SerializedName("currency") val currency: String = "$"
)

data class FcmTokenRequestDto(
    @SerializedName("doctorId") val doctorId: Int,
    @SerializedName("fcmToken") val fcmToken: String,
    @SerializedName("deviceModel") val deviceModel: String? = null,
    @SerializedName("osVersion") val osVersion: String? = null
)
