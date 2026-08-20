package com.hms.doctor.data.remote.dto

import com.google.gson.annotations.SerializedName

data class PatientSearchResultDto(
    @SerializedName("patients") val patients: List<PatientDto> = emptyList(),
    @SerializedName("total") val total: Int = 0,
    @SerializedName("page") val page: Int = 1,
    @SerializedName("limit") val limit: Int = 20,
    @SerializedName("totalPages") val totalPages: Int = 1
)

data class PatientDto(
    @SerializedName("id") val id: Int,
    @SerializedName("branchId") val branchId: Int = 1,
    @SerializedName("uhid") val uhid: String,
    @SerializedName("name") val name: String,
    @SerializedName("age") val age: Int,
    @SerializedName("gender") val gender: String,
    @SerializedName("bloodGroup") val bloodGroup: String? = null,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("condition") val condition: String? = null,
    @SerializedName("status") val status: String = "OPD",
    @SerializedName("address") val address: String? = null,
    @SerializedName("allergies") val allergies: List<String>? = null,
    @SerializedName("chronicConditions") val chronicConditions: List<String>? = null,
    @SerializedName("emergencyContactName") val emergencyContactName: String? = null,
    @SerializedName("emergencyContactPhone") val emergencyContactPhone: String? = null,
    @SerializedName("registeredDate") val registeredDate: String? = null,
    @SerializedName("lastVisitedDate") val lastVisitedDate: String? = null,
    @SerializedName("assignedDoctorName") val assignedDoctorName: String? = null,
    @SerializedName("assignedDoctorId") val assignedDoctorId: Int? = null,
    @SerializedName("bedNumber") val bedNumber: String? = null,
    @SerializedName("wardType") val wardType: String? = null
)

data class PatientHistoryDto(
    @SerializedName("patient") val patient: PatientDto,
    @SerializedName("vitals") val vitals: List<VitalsDto>? = null,
    @SerializedName("prescriptions") val prescriptions: List<PrescriptionDto>? = null,
    @SerializedName("reports") val reports: List<ReportDto>? = null,
    @SerializedName("admissions") val admissions: List<AdmissionDto>? = null,
    @SerializedName("timeline") val timeline: List<TimelineEventDto>? = null
)

data class VitalsDto(
    @SerializedName("id") val id: Int? = null,
    @SerializedName("bpSystolic") val bpSystolic: Int? = null,
    @SerializedName("bpDiastolic") val bpDiastolic: Int? = null,
    @SerializedName("heartRateBpm") val heartRateBpm: Int? = null,
    @SerializedName("temperatureCelsius") val temperatureCelsius: Double? = null,
    @SerializedName("spO2Percentage") val spO2Percentage: Int? = null,
    @SerializedName("respiratoryRateBpm") val respiratoryRateBpm: Int? = null,
    @SerializedName("weightKg") val weightKg: Double? = null,
    @SerializedName("heightCm") val heightCm: Double? = null,
    @SerializedName("bloodSugarMgDl") val bloodSugarMgDl: Double? = null,
    @SerializedName("bmi") val bmi: Double? = null,
    @SerializedName("isAbnormal") val isAbnormal: Boolean? = false,
    @SerializedName("notes") val notes: String? = null,
    @SerializedName("recordedAt") val recordedAt: String? = null
)

data class TimelineEventDto(
    @SerializedName("id") val id: Int,
    @SerializedName("patientId") val patientId: Int,
    @SerializedName("eventType") val eventType: String,
    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String? = null,
    @SerializedName("timestamp") val timestamp: String,
    @SerializedName("doctorName") val doctorName: String? = null,
    @SerializedName("department") val department: String? = null,
    @SerializedName("documentUrl") val documentUrl: String? = null
)
