package com.hms.doctor.feature.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.DoctorUser
import com.hms.doctor.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isRegisterMode: Boolean = false,
    val registerName: String = "",
    val registerChamberAddress: String = "",
    val registerPincode: String = "",
    val registerDistrict: String = "",
    val registerState: String = "",
    val registerReferenceId: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val loggedInUser: DoctorUser? = null,
    val isSuccess: Boolean = false
)

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun setAuthMode(isRegister: Boolean) {
        _uiState.update { it.copy(isRegisterMode = isRegister, errorMessage = null) }
    }

    fun onEmailChanged(email: String) {
        _uiState.update { it.copy(email = email, errorMessage = null) }
    }

    fun onPasswordChanged(password: String) {
        _uiState.update { it.copy(password = password, errorMessage = null) }
    }

    fun onRegisterNameChanged(name: String) {
        _uiState.update { it.copy(registerName = name, errorMessage = null) }
    }

    fun onRegisterChamberAddressChanged(address: String) {
        _uiState.update { it.copy(registerChamberAddress = address, errorMessage = null) }
    }

    fun onRegisterPincodeChanged(pincode: String) {
        _uiState.update { it.copy(registerPincode = pincode, errorMessage = null) }
    }

    fun onRegisterDistrictChanged(district: String) {
        _uiState.update { it.copy(registerDistrict = district, errorMessage = null) }
    }

    fun onRegisterStateChanged(state: String) {
        _uiState.update { it.copy(registerState = state, errorMessage = null) }
    }

    fun onRegisterReferenceIdChanged(refId: String) {
        _uiState.update { it.copy(registerReferenceId = refId, errorMessage = null) }
    }

    fun registerDoctor(onSuccess: () -> Unit) {
        val name = _uiState.value.registerName.trim()
        val chamberAddress = _uiState.value.registerChamberAddress.trim()
        val pincode = _uiState.value.registerPincode.trim()
        val district = _uiState.value.registerDistrict.trim()
        val state = _uiState.value.registerState.trim()
        val refId = _uiState.value.registerReferenceId.trim()
        val email = _uiState.value.email.trim()
        val password = _uiState.value.password.trim()

        if (name.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Full Practitioner Name is required.") }
            return
        }
        if (chamberAddress.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Chamber Address is required.") }
            return
        }
        if (pincode.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Pin Code is required.") }
            return
        }
        if (district.isBlank()) {
            _uiState.update { it.copy(errorMessage = "District is required.") }
            return
        }
        if (state.isBlank()) {
            _uiState.update { it.copy(errorMessage = "State is required.") }
            return
        }
        if (refId.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Reference ID is MANDATORY. Only authorized physicians with a valid reference ID can register.") }
            return
        }
        if (email.isBlank() || !email.contains("@")) {
            _uiState.update { it.copy(errorMessage = "Valid Practitioner Email is required.") }
            return
        }
        if (password.length < 6) {
            _uiState.update { it.copy(errorMessage = "Create Master Access Password (min 6 characters) is required.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, isNetworkError = false) }

            when (val result = authRepository.registerDoctor(
                name = name,
                email = email,
                password = password,
                chamberAddress = chamberAddress,
                pincode = pincode,
                district = district,
                state = state,
                referenceId = refId
            )) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            isSuccess = true,
                            loggedInUser = result.data,
                            errorMessage = null
                        )
                    }
                    onSuccess()
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

    fun login(onSuccess: () -> Unit) {
        val email = _uiState.value.email.trim()
        val password = _uiState.value.password.trim()

        if (email.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Please enter your doctor email or license ID.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, isNetworkError = false) }

            when (val result = authRepository.login(email = email, password = password)) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            isSuccess = true,
                            loggedInUser = result.data,
                            errorMessage = null
                        )
                    }
                    onSuccess()
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

    fun loginWithBiometrics(onSuccess: () -> Unit) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val result = authRepository.login(email = _uiState.value.email, password = null)
            when (result) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(isLoading = false, isSuccess = true, loggedInUser = result.data)
                    }
                    onSuccess()
                }
                is NetworkResult.Error -> {
                    _uiState.update {
                        it.copy(isLoading = false, errorMessage = result.message)
                    }
                }
                is NetworkResult.Loading -> {
                    _uiState.update { it.copy(isLoading = true) }
                }
            }
        }
    }

    fun clearError() {
        _uiState.update { it.copy(errorMessage = null) }
    }
}
