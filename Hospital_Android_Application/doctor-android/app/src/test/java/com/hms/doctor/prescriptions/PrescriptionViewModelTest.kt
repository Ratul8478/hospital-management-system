package com.hms.doctor.prescriptions

import com.hms.doctor.core.auth.SessionManager
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.Prescription
import com.hms.doctor.domain.model.PrescriptionItem
import com.hms.doctor.domain.repository.PrescriptionRepository
import com.hms.doctor.feature.prescriptions.MedicineFormItem
import com.hms.doctor.feature.prescriptions.PrescriptionViewModel
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class PrescriptionViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private val prescriptionRepository: PrescriptionRepository = mockk(relaxed = true)
    private val sessionManager: SessionManager = mockk(relaxed = true)
    private lateinit var viewModel: PrescriptionViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        viewModel = PrescriptionViewModel(prescriptionRepository, sessionManager)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun addAndRemoveMedicines_updatesStateCorrectly() {
        assertEquals(1, viewModel.uiState.value.medicines.size)

        viewModel.addMedicine()
        assertEquals(2, viewModel.uiState.value.medicines.size)

        viewModel.removeMedicine(1)
        assertEquals(1, viewModel.uiState.value.medicines.size)
    }

    @Test
    fun submitPrescription_withoutDiagnosis_showsValidationError() = runTest {
        viewModel.onDiagnosisChanged("")
        var successCalled = false
        viewModel.submitPrescription { successCalled = false }

        assertFalse(successCalled)
        assertNotNull(viewModel.uiState.value.errorMessage)
    }

    @Test
    fun submitPrescription_withValidData_callsRepositoryAndSucceeds() = runTest {
        val mockPrescription = Prescription(
            id = 8910,
            prescriptionNumber = "RX-2026-8910",
            appointmentId = 101,
            patientId = 401,
            uhid = "UHID-2026-0042",
            patientName = "Aarav Sharma",
            patientAge = 45,
            patientGender = "Male",
            doctorId = 1,
            doctorName = "Dr. Sarah Williams",
            department = "Cardiology",
            branchId = 1,
            diagnosis = "Primary Hypertension",
            symptoms = "Chest tightness",
            medicines = listOf(PrescriptionItem("Telmisartan 40mg", "Oral", "1 Tab", "Daily", "30 Days", "After food")),
            advice = "Low sodium diet",
            followUpDate = "2026-08-25",
            status = "ACTIVE",
            createdAt = "2026-08-16T11:00:00Z"
        )

        coEvery {
            prescriptionRepository.createPrescription(
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any(), any()
            )
        } returns NetworkResult.Success(mockPrescription)

        viewModel.initPatientContext(101, 401, "Aarav Sharma", "UHID-2026-0042", 45, "Male")
        viewModel.onDiagnosisChanged("Primary Hypertension")
        viewModel.updateMedicine(0, MedicineFormItem(name = "Telmisartan 40mg"))

        var submittedRx: Prescription? = null
        viewModel.submitPrescription { submittedRx = it }

        testDispatcher.scheduler.advanceUntilIdle()

        assertNotNull(submittedRx)
        assertEquals("RX-2026-8910", submittedRx?.prescriptionNumber)
        assertFalse(viewModel.uiState.value.isSubmitting)
    }
}
