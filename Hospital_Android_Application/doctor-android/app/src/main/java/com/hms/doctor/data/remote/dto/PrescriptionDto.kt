package com.hms.doctor.data.remote.dto

import com.google.gson.annotations.SerializedName

data class PrescriptionDto(
    @SerializedName("id") val id: Int,
    @SerializedName("prescriptionNumber") val prescriptionNumber: String? = null,
    @SerializedName("appointmentId") val appointmentId: Int? = null,
    @SerializedName("patientId") val patientId: Int,
    @SerializedName("uhid") val uhid: String,
    @SerializedName("patientName") val patientName: String,
    @SerializedName("patientAge") val patientAge: Int = 0,
    @SerializedName("patientGender") val patientGender: String? = null,
    @SerializedName("doctorId") val doctorId: Int,
    @SerializedName("doctorName") val doctorName: String,
    @SerializedName("department") val department: String? = null,
    @SerializedName("branchId") val branchId: Int = 1,
    @SerializedName("diagnosis") val diagnosis: String,
    @SerializedName("symptoms") val symptoms: String? = null,
    @SerializedName("medicines") val medicines: List<PrescriptionItemDto> = emptyList(),
    @SerializedName("medication") val medication: String? = null,
    @SerializedName("advice") val advice: String? = null,
    @SerializedName("followUpDate") val followUpDate: String? = null,
    @SerializedName("status") val status: String = "ACTIVE",
    @SerializedName("createdAt") val createdAt: String? = null
)

data class PrescriptionItemDto(
    @SerializedName("name") val name: String,
    @SerializedName("category") val category: String? = null,
    @SerializedName("dosage") val dosage: String,
    @SerializedName("frequency") val frequency: String? = null,
    @SerializedName("duration") val duration: String? = null,
    @SerializedName("durationDays") val durationDays: Int? = null,
    @SerializedName("instructions") val instructions: String? = null,
    @SerializedName("timing") val timing: String? = null
)

data class CreatePrescriptionRequestDto(
    @SerializedName("appointmentId") val appointmentId: Int? = null,
    @SerializedName("patientId") val patientId: Int,
    @SerializedName("uhid") val uhid: String,
    @SerializedName("patientName") val patientName: String,
    @SerializedName("patientAge") val patientAge: Int,
    @SerializedName("patientGender") val patientGender: String,
    @SerializedName("doctorId") val doctorId: Int,
    @SerializedName("doctorName") val doctorName: String,
    @SerializedName("branchId") val branchId: Int = 1,
    @SerializedName("diagnosis") val diagnosis: String,
    @SerializedName("symptoms") val symptoms: String? = null,
    @SerializedName("medicines") val medicines: List<PrescriptionItemDto> = emptyList(),
    @SerializedName("advice") val advice: String? = null,
    @SerializedName("followUpDate") val followUpDate: String? = null
)
