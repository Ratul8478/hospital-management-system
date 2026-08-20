package com.hms.doctor.feature.earnings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.DoctorEarnings
import com.hms.doctor.domain.repository.EarningsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class EarningsUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val selectedPeriod: String = "TODAY", // TODAY, THIS_MONTH, TOTAL
    val earnings: DoctorEarnings? = null
)

@HiltViewModel
class EarningsViewModel @Inject constructor(
    private val earningsRepository: EarningsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(EarningsUiState())
    val uiState: StateFlow<EarningsUiState> = _uiState.asStateFlow()

    init {
        loadEarnings()
    }

    fun loadEarnings() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = earningsRepository.getEarnings()) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            earnings = result.data,
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

    fun setPeriod(period: String) {
        _uiState.update { it.copy(selectedPeriod = period) }
    }
}
