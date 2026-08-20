package com.hms.doctor.feature.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.*
import com.hms.doctor.domain.repository.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val doctorName: String = "",
    val department: String = "",
    val specialty: String = "",
    val dutyStatus: String = "AVAILABLE",
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val queueStats: AppointmentQueueStats? = null,
    val nextPatient: Appointment? = null,
    val todayAppointments: List<Appointment> = emptyList(),
    val earnings: DoctorEarnings? = null,
    val pendingReportsCount: Int = 0,
    val activeInpatientsCount: Int = 0
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val appointmentRepository: AppointmentRepository,
    private val earningsRepository: EarningsRepository,
    private val reportRepository: ReportRepository,
    private val admissionRepository: AdmissionRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        HomeUiState(
            doctorName = authRepository.getCurrentDoctorName(),
            department = authRepository.getDepartment(),
            specialty = authRepository.getSpecialty()
        )
    )
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadDashboardData()
    }

    fun loadDashboardData(isRefresh: Boolean = false) {
        viewModelScope.launch {
            if (isRefresh) {
                _uiState.update { it.copy(isRefreshing = true, errorMessage = null) }
            } else {
                _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            }

            val apptsDeferred = async { appointmentRepository.getTodayAppointments() }
            val earningsDeferred = async { earningsRepository.getEarnings() }
            val reportsDeferred = async { reportRepository.getReports() }
            val admissionsDeferred = async { admissionRepository.getAdmissions() }

            val apptsResult = apptsDeferred.await()
            val earningsResult = earningsDeferred.await()
            val reportsResult = reportsDeferred.await()
            val admissionsResult = admissionsDeferred.await()

            var error: String? = null
            var networkErr = false

            var stats: AppointmentQueueStats? = null
            var appointments: List<Appointment> = emptyList()
            var nextPat: Appointment? = null

            if (apptsResult is NetworkResult.Success) {
                stats = apptsResult.data.first
                appointments = apptsResult.data.second
                nextPat = appointments.firstOrNull { it.status == "In Consultation" }
                    ?: appointments.firstOrNull { it.status == "Waiting" }
            } else if (apptsResult is NetworkResult.Error) {
                error = apptsResult.message
                networkErr = apptsResult.isNetworkError
            }

            var earnings: DoctorEarnings? = null
            if (earningsResult is NetworkResult.Success) {
                earnings = earningsResult.data
            }

            var pendingReports = 0
            if (reportsResult is NetworkResult.Success) {
                pendingReports = reportsResult.data.first.pending
            }

            var activeAdmissions = 0
            if (admissionsResult is NetworkResult.Success) {
                activeAdmissions = admissionsResult.data.size
            }

            _uiState.update {
                it.copy(
                    doctorName = authRepository.getCurrentDoctorName(),
                    department = authRepository.getDepartment(),
                    specialty = authRepository.getSpecialty(),
                    isLoading = false,
                    isRefreshing = false,
                    errorMessage = error,
                    isNetworkError = networkErr,
                    queueStats = stats,
                    todayAppointments = appointments,
                    nextPatient = nextPat,
                    earnings = earnings,
                    pendingReportsCount = pendingReports,
                    activeInpatientsCount = activeAdmissions
                )
            }
        }
    }

    fun startConsultation(appointmentId: Int, onComplete: () -> Unit) {
        viewModelScope.launch {
            appointmentRepository.updateAppointmentStatus(appointmentId, "In Consultation")
            loadDashboardData(isRefresh = true)
            onComplete()
        }
    }
}
