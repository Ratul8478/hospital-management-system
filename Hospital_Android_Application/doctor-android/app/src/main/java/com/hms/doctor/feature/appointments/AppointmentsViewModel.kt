package com.hms.doctor.feature.appointments

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.Appointment
import com.hms.doctor.domain.model.AppointmentQueueStats
import com.hms.doctor.domain.repository.AppointmentRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AppointmentsUiState(
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val selectedFilter: String = "ALL",
    val searchQuery: String = "",
    val queueStats: AppointmentQueueStats? = null,
    val appointments: List<Appointment> = emptyList(),
    val filteredAppointments: List<Appointment> = emptyList(),
    val selectedAppointment: Appointment? = null,
    val statusUpdateSuccessMessage: String? = null
)

@HiltViewModel
class AppointmentsViewModel @Inject constructor(
    private val appointmentRepository: AppointmentRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AppointmentsUiState())
    val uiState: StateFlow<AppointmentsUiState> = _uiState.asStateFlow()

    init {
        fetchAppointments()
    }

    fun fetchAppointments(isRefresh: Boolean = false) {
        viewModelScope.launch {
            if (isRefresh) {
                _uiState.update { it.copy(isRefreshing = true, errorMessage = null) }
            } else {
                _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            }

            when (val result = appointmentRepository.getTodayAppointments()) {
                is NetworkResult.Success -> {
                    val stats = result.data.first
                    val list = result.data.second
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            isRefreshing = false,
                            queueStats = stats,
                            appointments = list,
                            filteredAppointments = filterList(list, it.selectedFilter, it.searchQuery),
                            errorMessage = null
                        )
                    }
                }
                is NetworkResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            isRefreshing = false,
                            errorMessage = result.message,
                            isNetworkError = result.isNetworkError
                        )
                    }
                }
                is NetworkResult.Loading -> {
                    _uiState.update { it.copy(isLoading = true) }
                }
            }
        }
    }

    fun setFilter(filter: String) {
        _uiState.update {
            it.copy(
                selectedFilter = filter,
                filteredAppointments = filterList(it.appointments, filter, it.searchQuery)
            )
        }
    }

    fun setSearchQuery(query: String) {
        _uiState.update {
            it.copy(
                searchQuery = query,
                filteredAppointments = filterList(it.appointments, it.selectedFilter, query)
            )
        }
    }

    fun selectAppointmentById(appointmentId: Int) {
        val appt = _uiState.value.appointments.find { it.id == appointmentId }
        _uiState.update { it.copy(selectedAppointment = appt) }
    }

    fun updateStatus(appointmentId: Int, newStatus: String, notes: String? = null, onCompleted: (() -> Unit)? = null) {
        viewModelScope.launch {
            when (val result = appointmentRepository.updateAppointmentStatus(appointmentId, newStatus, notes)) {
                is NetworkResult.Success -> {
                    _uiState.update { it.copy(statusUpdateSuccessMessage = "Appointment marked as $newStatus") }
                    fetchAppointments(isRefresh = true)
                    selectAppointmentById(appointmentId)
                    onCompleted?.invoke()
                }
                is NetworkResult.Error -> {
                    _uiState.update { it.copy(errorMessage = result.message) }
                }
                is NetworkResult.Loading -> {}
            }
        }
    }

    private fun filterList(list: List<Appointment>, filter: String, query: String): List<Appointment> {
        return list.filter { appt ->
            val matchesFilter = when (filter) {
                "ALL" -> true
                "WAITING" -> appt.status.equals("Waiting", ignoreCase = true)
                "IN_CONSULTATION" -> appt.status.equals("In Consultation", ignoreCase = true)
                "COMPLETED" -> appt.status.equals("Completed", ignoreCase = true)
                "SCHEDULED" -> appt.status.equals("Scheduled", ignoreCase = true)
                else -> true
            }

            val matchesQuery = if (query.isBlank()) true else {
                appt.patientName.contains(query, ignoreCase = true) ||
                        appt.uhid.contains(query, ignoreCase = true) ||
                        appt.tokenNumber.toString() == query.trim()
            }

            matchesFilter && matchesQuery
        }
    }
}
