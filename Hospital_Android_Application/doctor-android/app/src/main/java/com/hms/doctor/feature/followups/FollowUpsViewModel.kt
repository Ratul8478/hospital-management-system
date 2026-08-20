package com.hms.doctor.feature.followups

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.FollowUp
import com.hms.doctor.domain.repository.FollowUpRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FollowUpsUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val followups: List<FollowUp> = emptyList()
)

@HiltViewModel
class FollowUpsViewModel @Inject constructor(
    private val followUpRepository: FollowUpRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(FollowUpsUiState())
    val uiState: StateFlow<FollowUpsUiState> = _uiState.asStateFlow()

    init {
        loadFollowUps()
    }

    fun loadFollowUps() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = followUpRepository.getFollowUps()) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            followups = result.data,
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
}
