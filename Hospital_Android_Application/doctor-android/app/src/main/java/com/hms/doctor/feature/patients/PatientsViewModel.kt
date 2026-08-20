package com.hms.doctor.feature.patients

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.Patient
import com.hms.doctor.domain.model.TimelineEvent
import com.hms.doctor.domain.repository.PatientRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PatientsUiState(
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val isHistoryLoading: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val patients: List<Patient> = emptyList(),
    val selectedPatient: Patient? = null,
    val timelineEvents: List<TimelineEvent> = emptyList()
)

@HiltViewModel
class PatientsViewModel @Inject constructor(
    private val patientRepository: PatientRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(PatientsUiState())
    val uiState: StateFlow<PatientsUiState> = _uiState.asStateFlow()

    init {
        searchPatients("")
    }

    fun onSearchQueryChanged(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
        searchPatients(query)
    }

    fun searchPatients(query: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            when (val result = patientRepository.searchPatients(query = if (query.isBlank()) null else query)) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            patients = result.data,
                            errorMessage = null
                        )
                    }
                }
                is NetworkResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
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

    fun loadPatientHistory(patientIdOrUhid: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isHistoryLoading = true, errorMessage = null) }

            when (val result = patientRepository.getPatientHistory(patientIdOrUhid)) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isHistoryLoading = false,
                            selectedPatient = result.data.first,
                            timelineEvents = result.data.second
                        )
                    }
                }
                is NetworkResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isHistoryLoading = false,
                            errorMessage = result.message,
                            isNetworkError = result.isNetworkError
                        )
                    }
                }
                is NetworkResult.Loading -> {
                    _uiState.update { it.copy(isHistoryLoading = true) }
                }
            }
        }
    }
}
