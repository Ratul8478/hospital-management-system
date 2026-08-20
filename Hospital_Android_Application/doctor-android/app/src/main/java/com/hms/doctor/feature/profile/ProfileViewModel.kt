package com.hms.doctor.feature.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.auth.SessionManager
import com.hms.doctor.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val doctorName: String = "",
    val email: String = "",
    val specialty: String = "",
    val department: String = "",
    val dutyStatus: String = "AVAILABLE",
    val isLoggingOut: Boolean = false
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        ProfileUiState(
            doctorName = sessionManager.getDoctorName(),
            email = sessionManager.getDoctorEmail(),
            specialty = sessionManager.getSpecialty(),
            department = sessionManager.getDepartment()
        )
    )
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    fun updateDutyStatus(status: String) {
        _uiState.update { it.copy(dutyStatus = status) }
    }

    fun logout(onLoggedOut: () -> Unit) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoggingOut = true) }
            authRepository.logout()
            onLoggedOut()
        }
    }
}
