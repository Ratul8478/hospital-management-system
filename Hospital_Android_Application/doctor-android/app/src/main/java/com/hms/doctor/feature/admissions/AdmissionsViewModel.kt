package com.hms.doctor.feature.admissions

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.Admission
import com.hms.doctor.domain.repository.AdmissionRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AdmissionsUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val selectedWard: String = "ALL", // ALL, ICU, PRIVATE, GENERAL
    val admissions: List<Admission> = emptyList(),
    val filteredAdmissions: List<Admission> = emptyList()
)

@HiltViewModel
class AdmissionsViewModel @Inject constructor(
    private val admissionRepository: AdmissionRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AdmissionsUiState())
    val uiState: StateFlow<AdmissionsUiState> = _uiState.asStateFlow()

    init {
        loadAdmissions()
    }

    fun loadAdmissions() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = admissionRepository.getAdmissions()) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            admissions = result.data,
                            filteredAdmissions = filterList(result.data, it.selectedWard),
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
                is NetworkResult.Loading -> {}
            }
        }
    }

    fun setWardFilter(ward: String) {
        _uiState.update {
            it.copy(
                selectedWard = ward,
                filteredAdmissions = filterList(it.admissions, ward)
            )
        }
    }

    private fun filterList(list: List<Admission>, ward: String): List<Admission> {
        return when (ward) {
            "ALL" -> list
            "ICU" -> list.filter { it.wardType.equals("icu", ignoreCase = true) }
            "PRIVATE" -> list.filter { it.wardType.equals("private", ignoreCase = true) }
            "GENERAL" -> list.filter { it.wardType.equals("general", ignoreCase = true) }
            else -> list
        }
    }
}
