package com.hms.doctor.domain.model

data class DoctorUser(
    val id: Int,
    val name: String,
    val email: String,
    val phone: String?,
    val specialty: String?,
    val department: String?,
    val qualification: String?,
    val registrationNumber: String?,
    val branchId: Int,
    val branchCode: String?,
    val branchName: String?,
    val fee: Double,
    val status: String,
    val role: String,
    val avatarUrl: String?
)

data class Appointment(
    val id: Int,
    val branchId: Int,
    val branchName: String?,
    val patientId: Int,
    val patientName: String,
    val uhid: String,
    val patientAge: Int,
    val patientGender: String?,
    val patientPhone: String?,
    val doctorId: Int,
    val doctorName: String?,
    val department: String?,
    val appointmentDate: String,
    val appointmentTime: String,
    val tokenNumber: Int,
    val type: String,
    val status: String,
    val symptoms: String?,
    val notes: String?,
    val consultationRoom: String?,
    val queuePosition: Int?,
    val vitals: Vitals?
)

data class AppointmentQueueStats(
    val total: Int,
    val waiting: Int,
    val inConsultation: Int,
    val completed: Int,
    val scheduled: Int,
    val activeToken: Int
)

data class Patient(
    val id: Int,
    val branchId: Int,
    val uhid: String,
    val name: String,
    val age: Int,
    val gender: String,
    val bloodGroup: String?,
    val phone: String?,
    val email: String?,
    val condition: String?,
    val status: String,
    val address: String?,
    val allergies: List<String>?,
    val chronicConditions: List<String>?,
    val emergencyContactName: String?,
    val emergencyContactPhone: String?,
    val registeredDate: String?,
    val lastVisitedDate: String?,
    val assignedDoctorName: String?,
    val assignedDoctorId: Int?,
    val bedNumber: String?,
    val wardType: String?
)

data class Vitals(
    val bpSystolic: Int?,
    val bpDiastolic: Int?,
    val heartRateBpm: Int?,
    val temperatureCelsius: Double?,
    val spO2Percentage: Int?,
    val bloodSugarMgDl: Double?,
    val bmi: Double?,
    val isAbnormal: Boolean?,
    val notes: String?,
    val recordedAt: String?
)

data class TimelineEvent(
    val id: Int,
    val patientId: Int,
    val eventType: String,
    val title: String,
    val description: String?,
    val timestamp: String,
    val doctorName: String?,
    val department: String?,
    val documentUrl: String?
)

data class Prescription(
    val id: Int,
    val prescriptionNumber: String?,
    val appointmentId: Int?,
    val patientId: Int,
    val uhid: String,
    val patientName: String,
    val patientAge: Int,
    val patientGender: String?,
    val doctorId: Int,
    val doctorName: String,
    val department: String?,
    val branchId: Int,
    val diagnosis: String,
    val symptoms: String?,
    val medicines: List<PrescriptionItem>,
    val advice: String?,
    val followUpDate: String?,
    val status: String,
    val createdAt: String?
)

data class PrescriptionItem(
    val name: String,
    val category: String?,
    val dosage: String,
    val frequency: String?,
    val duration: String?,
    val instructions: String?
)

data class DiagnosticReport(
    val id: Int,
    val patientId: Int,
    val uhid: String,
    val patientName: String,
    val doctorId: Int?,
    val doctorName: String?,
    val testName: String,
    val category: String,
    val status: String, // ready, pending, processing
    val resultSummary: String?,
    val criticalAlert: Boolean,
    val criticalDetails: String?,
    val sampleCollectedAt: String?,
    val reportedAt: String?,
    val fileUrl: String?
)

data class ReportsSummary(
    val total: Int,
    val ready: Int,
    val pending: Int,
    val criticalAlerts: Int
)

data class Admission(
    val id: Int,
    val patientId: Int,
    val uhid: String,
    val patientName: String,
    val patientAge: Int,
    val patientGender: String?,
    val doctorId: Int,
    val doctorName: String?,
    val branchId: Int,
    val branchName: String?,
    val wardType: String,
    val roomNumber: String,
    val bedNumber: String,
    val admissionDate: String,
    val diagnosis: String,
    val status: String,
    val nursingNotes: String?,
    val currentCondition: String?,
    val attendingNurse: String?
)

data class FollowUp(
    val id: Int,
    val patientId: Int,
    val uhid: String,
    val patientName: String,
    val patientPhone: String?,
    val doctorId: Int,
    val doctorName: String?,
    val scheduledDate: String,
    val reason: String,
    val status: String,
    val notes: String?
)

data class DoctorEarnings(
    val doctorId: Int,
    val doctorName: String,
    val specialty: String?,
    val fee: Double,
    val todayConsultations: Int,
    val todayEarnings: Double,
    val monthConsultations: Int,
    val monthEarnings: Double,
    val totalConsultations: Int,
    val totalEarnings: Double,
    val pendingPayout: Double,
    val currency: String
)

data class HospitalReferral(
    val referralId: String,
    val patientId: Int,
    val uhid: String,
    val patientName: String,
    val patientAge: Int,
    val patientGender: String?,
    val targetHospitalId: String,
    val targetHospitalName: String,
    val targetDoctorId: Int? = null,
    val targetDoctorName: String? = null,
    val targetDepartment: String,
    val urgencyLevel: String,
    val clinicalSummary: String,
    val diagnosis: String,
    val vitalsSummary: String?,
    val referringDoctorId: Int,
    val referringDoctorName: String,
    val timestamp: String,
    val status: String
)

data class HospitalBranch(
    val id: Int,
    val code: String,
    val name: String,
    val location: String,
    val address: String?,
    val branchHead: String?,
    val status: String,
    val phone: String?,
    val doctors: List<BranchDoctor> = emptyList()
)

data class BranchDoctor(
    val id: Int,
    val branchId: Int,
    val name: String,
    val specialty: String,
    val qualification: String?,
    val status: String,
    val fee: Double
)
