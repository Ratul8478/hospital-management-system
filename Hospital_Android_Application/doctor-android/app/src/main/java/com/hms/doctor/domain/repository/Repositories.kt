package com.hms.doctor.domain.repository

import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.*

interface AuthRepository {
    suspend fun login(email: String, password: String?): NetworkResult<DoctorUser>
    suspend fun registerDoctor(
        name: String,
        email: String,
        password: String,
        chamberAddress: String,
        pincode: String,
        district: String,
        state: String,
        referenceId: String
    ): NetworkResult<DoctorUser>
    suspend fun logout(): NetworkResult<Unit>
    fun isLoggedIn(): Boolean
    fun getCurrentDoctorName(): String
    fun getDepartment(): String
    fun getSpecialty(): String
    fun getDoctorId(): Int
}

interface AppointmentRepository {
    suspend fun getTodayAppointments(
        doctorId: Int? = null,
        branchId: Int? = null,
        status: String? = null
    ): NetworkResult<Pair<AppointmentQueueStats, List<Appointment>>>

    suspend fun updateAppointmentStatus(
        appointmentId: Int,
        status: String,
        notes: String? = null,
        consultationRoom: String? = null
    ): NetworkResult<Appointment>
}

interface PatientRepository {
    suspend fun searchPatients(
        query: String? = null,
        branchId: Int? = null,
        page: Int = 1,
        limit: Int = 20
    ): NetworkResult<List<Patient>>

    suspend fun getPatientHistory(
        patientIdOrUhid: String
    ): NetworkResult<Pair<Patient, List<TimelineEvent>>>

    suspend fun referPatientToHospital(
        patientId: Int,
        uhid: String,
        patientName: String,
        targetHospitalId: String,
        targetHospitalName: String,
        targetDepartment: String,
        urgencyLevel: String,
        clinicalSummary: String,
        diagnosis: String,
        vitalsSummary: String? = null
    ): NetworkResult<HospitalReferral>
}

interface PrescriptionRepository {
    suspend fun getPrescriptions(
        doctorId: Int? = null,
        patientId: Int? = null,
        uhid: String? = null,
        search: String? = null
    ): NetworkResult<List<Prescription>>

    suspend fun createPrescription(
        appointmentId: Int?,
        patientId: Int,
        uhid: String,
        patientName: String,
        patientAge: Int,
        patientGender: String,
        doctorId: Int,
        doctorName: String,
        branchId: Int,
        diagnosis: String,
        symptoms: String?,
        medicines: List<PrescriptionItem>,
        advice: String?,
        followUpDate: String?
    ): NetworkResult<Prescription>
}

interface ReportRepository {
    suspend fun getReports(
        doctorId: Int? = null,
        patientId: Int? = null,
        uhid: String? = null,
        category: String? = null,
        status: String? = null
    ): NetworkResult<Pair<ReportsSummary, List<DiagnosticReport>>>
}

interface AdmissionRepository {
    suspend fun getAdmissions(
        doctorId: Int? = null,
        branchId: Int? = null,
        wardType: String? = null
    ): NetworkResult<List<Admission>>
}

interface FollowUpRepository {
    suspend fun getFollowUps(
        doctorId: Int? = null,
        date: String? = null,
        status: String? = null
    ): NetworkResult<List<FollowUp>>
}

interface EarningsRepository {
    suspend fun getEarnings(
        doctorId: Int? = null
    ): NetworkResult<DoctorEarnings>
}

interface NotificationRepository {
    suspend fun registerFcmToken(
        doctorId: Int,
        fcmToken: String
    ): NetworkResult<Unit>
}
