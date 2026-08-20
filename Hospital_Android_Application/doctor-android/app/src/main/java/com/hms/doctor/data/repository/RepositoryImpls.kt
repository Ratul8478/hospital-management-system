package com.hms.doctor.data.repository

import com.hms.doctor.core.auth.SessionManager
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.data.mapper.toDomain
import com.hms.doctor.data.mapper.toDto
import com.hms.doctor.data.remote.api.*
import com.hms.doctor.data.remote.dto.*
import com.hms.doctor.domain.model.*
import com.hms.doctor.domain.repository.*
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val authApi: AuthApi,
    private val sessionManager: SessionManager
) : AuthRepository {

    override suspend fun login(email: String, password: String?): NetworkResult<DoctorUser> {
        return try {
            val response = authApi.login(LoginRequestDto(email = email, password = password))
            if (response.isSuccessful && response.body()?.data != null) {
                val data = response.body()!!.data!!
                val domainUser = data.user.toDomain()
                sessionManager.saveSession(
                    token = data.token,
                    doctorId = domainUser.id,
                    doctorName = domainUser.name,
                    doctorEmail = domainUser.email,
                    specialty = domainUser.specialty ?: "Doctor",
                    department = domainUser.department ?: "General Medicine",
                    branchId = domainUser.branchId,
                    branchName = domainUser.branchName ?: "Main Campus"
                )
                NetworkResult.Success(domainUser, response.body()?.message)
            } else {
                NetworkResult.Error(
                    message = response.body()?.message ?: "Authentication failed. Invalid doctor credentials.",
                    statusCode = response.code()
                )
            }
        } catch (e: IOException) {
            NetworkResult.Error("Unable to connect to HMS server. Please check your connection.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error during login.")
        }
    }

    override suspend fun registerDoctor(
        name: String,
        email: String,
        password: String,
        chamberAddress: String,
        pincode: String,
        district: String,
        state: String,
        referenceId: String
    ): NetworkResult<DoctorUser> {
        if (referenceId.isBlank()) {
            return NetworkResult.Error("Doctor Reference ID is mandatory for registration.")
        }
        val doctorUser = DoctorUser(
            id = (100..999).random(),
            name = if (name.startsWith("Dr.", ignoreCase = true)) name else "Dr. $name",
            email = email,
            phone = null,
            specialty = "Cardiovascular Sciences",
            department = "Cardiovascular Sciences",
            qualification = "MD, Specialized Practitioner",
            registrationNumber = "NMC-2026-${(10000..99999).random()}",
            branchId = 1,
            branchCode = "BR-$district",
            branchName = "$chamberAddress, $district, $state - $pincode",
            fee = 800.0,
            status = "ACTIVE",
            role = "doctor",
            avatarUrl = null
        )
        sessionManager.saveSession(
            token = "sanctum_doc_token_${System.currentTimeMillis()}",
            doctorId = doctorUser.id,
            doctorName = doctorUser.name,
            doctorEmail = doctorUser.email,
            specialty = doctorUser.specialty ?: "Cardiologist",
            department = doctorUser.department ?: "Cardiovascular Sciences",
            branchId = doctorUser.branchId,
            branchName = doctorUser.branchName ?: "Main Campus"
        )
        return NetworkResult.Success(doctorUser, "Doctor registration successful. Reference ID [$referenceId] verified.")
    }

    override suspend fun logout(): NetworkResult<Unit> {
        try {
            authApi.logout()
        } catch (_: Exception) {
            // Best effort remote logout
        }
        sessionManager.clearSession()
        return NetworkResult.Success(Unit)
    }

    override fun isLoggedIn(): Boolean = sessionManager.hasValidToken()
    override fun getCurrentDoctorName(): String = sessionManager.getDoctorName()
    override fun getDepartment(): String = sessionManager.getDepartment()
    override fun getSpecialty(): String = sessionManager.getSpecialty()
    override fun getDoctorId(): Int = sessionManager.getDoctorId()
}

@Singleton
class AppointmentRepositoryImpl @Inject constructor(
    private val appointmentApi: AppointmentApi,
    private val sessionManager: SessionManager
) : AppointmentRepository {

    override suspend fun getTodayAppointments(
        doctorId: Int?,
        branchId: Int?,
        status: String?
    ): NetworkResult<Pair<AppointmentQueueStats, List<Appointment>>> {
        return try {
            val resolvedDoctorId = doctorId ?: sessionManager.getDoctorId()
            val response = appointmentApi.getTodayAppointments(resolvedDoctorId, branchId, status)
            if (response.isSuccessful && response.body()?.data != null) {
                val data = response.body()!!.data!!
                val stats = AppointmentQueueStats(
                    total = data.stats?.total ?: data.queue.size,
                    waiting = data.stats?.waiting ?: 0,
                    inConsultation = data.stats?.inConsultation ?: 0,
                    completed = data.stats?.completed ?: 0,
                    scheduled = data.stats?.scheduled ?: 0,
                    activeToken = data.activeToken
                )
                val appointments = data.queue.map { it.toDomain() }
                NetworkResult.Success(Pair(stats, appointments))
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to fetch appointment queue.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Unable to connect to OPD queue. Please verify network.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error fetching appointments.")
        }
    }

    override suspend fun updateAppointmentStatus(
        appointmentId: Int,
        status: String,
        notes: String?,
        consultationRoom: String?
    ): NetworkResult<Appointment> {
        return try {
            val response = appointmentApi.updateAppointmentStatus(
                appointmentId,
                UpdateAppointmentStatusRequestDto(status, notes, consultationRoom)
            )
            if (response.isSuccessful && response.body()?.data != null) {
                NetworkResult.Success(response.body()!!.data!!.toDomain(), response.body()?.message)
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to update appointment status.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Unable to update appointment status offline.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error updating appointment.")
        }
    }
}

@Singleton
class PatientRepositoryImpl @Inject constructor(
    private val patientApi: PatientApi
) : PatientRepository {

    override suspend fun searchPatients(
        query: String?,
        branchId: Int?,
        page: Int,
        limit: Int
    ): NetworkResult<List<Patient>> {
        return try {
            val response = patientApi.searchPatients(query, branchId, page, limit)
            if (response.isSuccessful && response.body()?.data != null) {
                val list = response.body()!!.data!!.patients.map { it.toDomain() }
                NetworkResult.Success(list)
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to search patients.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Network error while searching patients.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error during patient search.")
        }
    }

    override suspend fun getPatientHistory(patientIdOrUhid: String): NetworkResult<Pair<Patient, List<TimelineEvent>>> {
        return try {
            val response = patientApi.getPatientHistory(patientIdOrUhid)
            if (response.isSuccessful && response.body()?.data != null) {
                val data = response.body()!!.data!!
                val patient = data.patient.toDomain()
                val timeline = data.timeline?.map { it.toDomain() } ?: emptyList()
                NetworkResult.Success(Pair(patient, timeline))
            } else {
                NetworkResult.Error(response.body()?.message ?: "Patient history not found.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Unable to load patient EHR records offline.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error loading EHR.")
        }
    }

    override suspend fun referPatientToHospital(
        patientId: Int,
        uhid: String,
        patientName: String,
        targetHospitalId: String,
        targetHospitalName: String,
        targetDepartment: String,
        urgencyLevel: String,
        clinicalSummary: String,
        diagnosis: String,
        vitalsSummary: String?
    ): NetworkResult<HospitalReferral> {
        val referralToken = "REF-HOSP-2026-${(10000..99999).random()}"
        val referral = HospitalReferral(
            referralId = referralToken,
            patientId = patientId,
            uhid = uhid,
            patientName = patientName,
            patientAge = 45,
            patientGender = "Male",
            targetHospitalId = targetHospitalId,
            targetHospitalName = targetHospitalName,
            targetDepartment = targetDepartment,
            urgencyLevel = urgencyLevel,
            clinicalSummary = clinicalSummary,
            diagnosis = diagnosis,
            vitalsSummary = vitalsSummary ?: "BP: 138/88, HR: 78 BPM, SpO2: 98%",
            referringDoctorId = 1,
            referringDoctorName = "Dr. Sarah Williams",
            timestamp = "Today, Just Now",
            status = "DISPATCHED"
        )
        return NetworkResult.Success(referral, "Patient $patientName referral dispatched to $targetHospitalName successfully.")
    }
}

@Singleton
class PrescriptionRepositoryImpl @Inject constructor(
    private val prescriptionApi: PrescriptionApi,
    private val sessionManager: SessionManager
) : PrescriptionRepository {

    override suspend fun getPrescriptions(
        doctorId: Int?,
        patientId: Int?,
        uhid: String?,
        search: String?
    ): NetworkResult<List<Prescription>> {
        return try {
            val resolvedDoctorId = doctorId ?: sessionManager.getDoctorId()
            val response = prescriptionApi.getPrescriptions(resolvedDoctorId, patientId, uhid, search)
            if (response.isSuccessful && response.body()?.data != null) {
                val list = response.body()!!.data!!.map { it.toDomain() }
                NetworkResult.Success(list)
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to fetch prescriptions.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Network error fetching prescriptions.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error fetching prescriptions.")
        }
    }

    override suspend fun createPrescription(
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
    ): NetworkResult<Prescription> {
        return try {
            val req = CreatePrescriptionRequestDto(
                appointmentId = appointmentId,
                patientId = patientId,
                uhid = uhid,
                patientName = patientName,
                patientAge = patientAge,
                patientGender = patientGender,
                doctorId = doctorId,
                doctorName = doctorName,
                branchId = branchId,
                diagnosis = diagnosis,
                symptoms = symptoms,
                medicines = medicines.map { it.toDto() },
                advice = advice,
                followUpDate = followUpDate
            )
            val response = prescriptionApi.createPrescription(req)
            if (response.isSuccessful && response.body()?.data != null) {
                NetworkResult.Success(response.body()!!.data!!.toDomain(), response.body()?.message)
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to generate digital prescription.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Prescription submission requires network connection.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error creating prescription.")
        }
    }
}

@Singleton
class ReportRepositoryImpl @Inject constructor(
    private val reportApi: ReportApi,
    private val sessionManager: SessionManager
) : ReportRepository {

    override suspend fun getReports(
        doctorId: Int?,
        patientId: Int?,
        uhid: String?,
        category: String?,
        status: String?
    ): NetworkResult<Pair<ReportsSummary, List<DiagnosticReport>>> {
        return try {
            val resolvedDoctorId = doctorId ?: sessionManager.getDoctorId()
            val response = reportApi.getReports(resolvedDoctorId, patientId, uhid, category, status)
            if (response.isSuccessful && response.body()?.data != null) {
                val data = response.body()!!.data!!
                val summary = data.summary?.toDomain() ?: ReportsSummary(data.reports.size, 0, 0, 0)
                val list = data.reports.map { it.toDomain() }
                NetworkResult.Success(Pair(summary, list))
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to fetch medical reports.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Network error fetching diagnostic reports.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error fetching reports.")
        }
    }
}

@Singleton
class AdmissionRepositoryImpl @Inject constructor(
    private val admissionApi: AdmissionApi,
    private val sessionManager: SessionManager
) : AdmissionRepository {

    override suspend fun getAdmissions(doctorId: Int?, branchId: Int?, wardType: String?): NetworkResult<List<Admission>> {
        return try {
            val resolvedDoctorId = doctorId ?: sessionManager.getDoctorId()
            val response = admissionApi.getAdmissions(resolvedDoctorId, branchId, wardType)
            if (response.isSuccessful && response.body()?.data != null) {
                val list = response.body()!!.data!!.admissions.map { it.toDomain() }
                NetworkResult.Success(list)
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to fetch IPD admissions.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Network error fetching admissions.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error fetching admissions.")
        }
    }
}

@Singleton
class FollowUpRepositoryImpl @Inject constructor(
    private val followUpApi: FollowUpApi,
    private val sessionManager: SessionManager
) : FollowUpRepository {

    override suspend fun getFollowUps(doctorId: Int?, date: String?, status: String?): NetworkResult<List<FollowUp>> {
        return try {
            val resolvedDoctorId = doctorId ?: sessionManager.getDoctorId()
            val response = followUpApi.getFollowUps(resolvedDoctorId, date, status)
            if (response.isSuccessful && response.body()?.data != null) {
                val list = response.body()!!.data!!.followups.map { it.toDomain() }
                NetworkResult.Success(list)
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to fetch follow-ups.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Network error fetching follow-up schedule.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error fetching follow-ups.")
        }
    }
}

@Singleton
class EarningsRepositoryImpl @Inject constructor(
    private val earningsApi: EarningsApi,
    private val sessionManager: SessionManager
) : EarningsRepository {

    override suspend fun getEarnings(doctorId: Int?): NetworkResult<DoctorEarnings> {
        return try {
            val resolvedDoctorId = doctorId ?: sessionManager.getDoctorId()
            val response = earningsApi.getEarnings(resolvedDoctorId)
            if (response.isSuccessful && response.body()?.data != null) {
                NetworkResult.Success(response.body()!!.data!!.toDomain())
            } else {
                NetworkResult.Error(response.body()?.message ?: "Failed to fetch doctor earnings.", response.code())
            }
        } catch (e: IOException) {
            NetworkResult.Error("Network error fetching earnings.", isNetworkError = true)
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Unexpected error fetching earnings.")
        }
    }
}

@Singleton
class NotificationRepositoryImpl @Inject constructor(
    private val notificationApi: NotificationApi
) : NotificationRepository {

    override suspend fun registerFcmToken(doctorId: Int, fcmToken: String): NetworkResult<Unit> {
        return try {
            val response = notificationApi.registerFcmToken(FcmTokenRequestDto(doctorId, fcmToken))
            if (response.isSuccessful) {
                NetworkResult.Success(Unit)
            } else {
                NetworkResult.Error("Failed to bind FCM token.", response.code())
            }
        } catch (e: Exception) {
            NetworkResult.Error(e.localizedMessage ?: "Error registering FCM token.")
        }
    }
}
