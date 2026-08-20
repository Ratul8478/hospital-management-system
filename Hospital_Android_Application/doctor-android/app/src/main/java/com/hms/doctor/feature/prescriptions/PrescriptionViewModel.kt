package com.hms.doctor.feature.prescriptions

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.auth.SessionManager
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.Prescription
import com.hms.doctor.domain.model.PrescriptionItem
import com.hms.doctor.domain.repository.PrescriptionRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class MedicineFormItem(
    val name: String = "",
    val dosage: String = "1 Tablet",
    val frequency: String = "Once daily (Morning, after food)",
    val duration: String = "7 Days",
    val instructions: String = "Take after food"
)

data class PrescriptionUiState(
    val appointmentId: Int? = null,
    val patientId: Int = 0,
    val uhid: String = "",
    val patientName: String = "",
    val patientAge: Int = 40,
    val patientGender: String = "Male",
    val diagnosis: String = "",
    val symptoms: String = "",
    val advice: String = "Drink plenty of water and get adequate rest.",
    val followUpDate: String = "",
    val medicines: List<MedicineFormItem> = listOf(MedicineFormItem()),
    val isSubmitting: Boolean = false,
    val isFetching: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val submittedPrescription: Prescription? = null,
    val prescriptionsList: List<Prescription> = emptyList()
)

@HiltViewModel
class PrescriptionViewModel @Inject constructor(
    private val prescriptionRepository: PrescriptionRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(PrescriptionUiState())
    val uiState: StateFlow<PrescriptionUiState> = _uiState.asStateFlow()

    fun initPatientContext(
        appointmentId: Int?,
        patientId: Int,
        patientName: String,
        uhid: String,
        age: Int,
        gender: String
    ) {
        _uiState.update {
            it.copy(
                appointmentId = appointmentId,
                patientId = patientId,
                patientName = patientName,
                uhid = uhid,
                patientAge = age,
                patientGender = gender,
                errorMessage = null,
                submittedPrescription = null
            )
        }
    }

    fun onDiagnosisChanged(diag: String) {
        _uiState.update { it.copy(diagnosis = diag, errorMessage = null) }
    }

    fun onSymptomsChanged(symp: String) {
        _uiState.update { it.copy(symptoms = symp) }
    }

    fun onAdviceChanged(advice: String) {
        _uiState.update { it.copy(advice = advice) }
    }

    fun onFollowUpDateChanged(date: String) {
        _uiState.update { it.copy(followUpDate = date) }
    }

    fun addMedicine() {
        val updated = _uiState.value.medicines.toMutableList().apply {
            add(MedicineFormItem())
        }
        _uiState.update { it.copy(medicines = updated) }
    }

    fun removeMedicine(index: Int) {
        if (_uiState.value.medicines.size > 1) {
            val updated = _uiState.value.medicines.toMutableList().apply {
                removeAt(index)
            }
            _uiState.update { it.copy(medicines = updated) }
        }
    }

    fun updateMedicine(index: Int, updatedItem: MedicineFormItem) {
        val updated = _uiState.value.medicines.toMutableList().apply {
            set(index, updatedItem)
        }
        _uiState.update { it.copy(medicines = updated) }
    }

    fun fetchPrescriptionsList() {
        viewModelScope.launch {
            _uiState.update { it.copy(isFetching = true, errorMessage = null) }
            when (val result = prescriptionRepository.getPrescriptions()) {
                is NetworkResult.Success -> {
                    _uiState.update { it.copy(isFetching = false, prescriptionsList = result.data) }
                }
                is NetworkResult.Error -> {
                    _uiState.update { it.copy(isFetching = false, errorMessage = result.message) }
                }
                is NetworkResult.Loading -> {}
            }
        }
    }

    fun submitPrescription(onSuccess: (Prescription) -> Unit) {
        val state = _uiState.value

        if (state.diagnosis.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Please enter clinical diagnosis before issuing prescription.") }
            return
        }

        val validMedicines = state.medicines.filter { it.name.isNotBlank() }
        if (validMedicines.isEmpty()) {
            _uiState.update { it.copy(errorMessage = "Please add at least one medication with a valid name.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSubmitting = true, errorMessage = null) }

            val result = prescriptionRepository.createPrescription(
                appointmentId = state.appointmentId,
                patientId = state.patientId,
                uhid = state.uhid,
                patientName = state.patientName,
                patientAge = state.patientAge,
                patientGender = state.patientGender,
                doctorId = sessionManager.getDoctorId(),
                doctorName = sessionManager.getDoctorName(),
                branchId = 1,
                diagnosis = state.diagnosis,
                symptoms = state.symptoms,
                medicines = validMedicines.map {
                    PrescriptionItem(
                        name = it.name,
                        category = "Oral",
                        dosage = it.dosage,
                        frequency = it.frequency,
                        duration = it.duration,
                        instructions = it.instructions
                    )
                },
                advice = state.advice,
                followUpDate = state.followUpDate.ifBlank { null }
            )

            when (result) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isSubmitting = false,
                            submittedPrescription = result.data,
                            errorMessage = null
                        )
                    }
                    onSuccess(result.data)
                }
                is NetworkResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isSubmitting = false,
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
