package com.hms.doctor.data.remote.dto

import com.google.gson.annotations.SerializedName

data class TodayAppointmentsResponseDto(
    @SerializedName("date") val date: String? = null,
    @SerializedName("activeToken") val activeToken: Int = 10,
    @SerializedName("stats") val stats: AppointmentStatsDto? = null,
    @SerializedName("queue") val queue: List<AppointmentDto> = emptyList()
)

data class AppointmentStatsDto(
    @SerializedName("total") val total: Int = 0,
    @SerializedName("waiting") val waiting: Int = 0,
    @SerializedName("inConsultation") val inConsultation: Int = 0,
    @SerializedName("completed") val completed: Int = 0,
    @SerializedName("scheduled") val scheduled: Int = 0
)

data class AppointmentDto(
    @SerializedName("id") val id: Int,
    @SerializedName("branchId") val branchId: Int = 1,
    @SerializedName("branchName") val branchName: String? = null,
    @SerializedName("patientId") val patientId: Int,
    @SerializedName("patientName") val patientName: String,
    @SerializedName("uhid") val uhid: String,
    @SerializedName("patientAge") val patientAge: Int = 0,
    @SerializedName("patientGender") val patientGender: String? = null,
    @SerializedName("patientPhone") val patientPhone: String? = null,
    @SerializedName("doctorId") val doctorId: Int,
    @SerializedName("doctorName") val doctorName: String? = null,
    @SerializedName("department") val department: String? = null,
    @SerializedName("appointmentDate") val appointmentDate: String,
    @SerializedName("appointmentTime") val appointmentTime: String,
    @SerializedName("tokenNumber") val tokenNumber: Int,
    @SerializedName("type") val type: String = "OPD",
    @SerializedName("status") val status: String,
    @SerializedName("symptoms") val symptoms: String? = null,
    @SerializedName("notes") val notes: String? = null,
    @SerializedName("consultationRoom") val consultationRoom: String? = null,
    @SerializedName("queuePosition") val queuePosition: Int? = null,
    @SerializedName("vitals") val vitals: VitalsDto? = null
)

data class UpdateAppointmentStatusRequestDto(
    @SerializedName("status") val status: String,
    @SerializedName("notes") val notes: String? = null,
    @SerializedName("consultationRoom") val consultationRoom: String? = null
)
