package com.hms.doctor.appointments

import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.Appointment
import com.hms.doctor.domain.model.AppointmentQueueStats
import com.hms.doctor.domain.repository.AppointmentRepository
import com.hms.doctor.feature.appointments.AppointmentsViewModel
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
class AppointmentsViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private val appointmentRepository: AppointmentRepository = mockk(relaxed = true)
    private lateinit var viewModel: AppointmentsViewModel

    private val mockAppointments = listOf(
        Appointment(
            id = 101,
            branchId = 1,
            branchName = "Main Hospital",
            patientId = 401,
            patientName = "Aarav Sharma",
            uhid = "UHID-2026-0042",
            patientAge = 45,
            patientGender = "Male",
            patientPhone = "+91 98765 43210",
            doctorId = 1,
            doctorName = "Dr. Sarah Williams",
            department = "Cardiology",
            appointmentDate = "2026-08-16",
            appointmentTime = "10:30 AM",
            tokenNumber = 14,
            type = "OPD",
            status = "Waiting",
            symptoms = "Chest discomfort",
            notes = "Hypertension history",
            consultationRoom = "OPD-302",
            queuePosition = 1,
            vitals = null
        ),
        Appointment(
            id = 102,
            branchId = 1,
            branchName = "Main Hospital",
            patientId = 402,
            patientName = "Priya Patel",
            uhid = "UHID-2026-0089",
            patientAge = 32,
            patientGender = "Female",
            patientPhone = "+91 98765 43211",
            doctorId = 1,
            doctorName = "Dr. Sarah Williams",
            department = "Cardiology",
            appointmentDate = "2026-08-16",
            appointmentTime = "11:00 AM",
            tokenNumber = 15,
            type = "OPD",
            status = "In Consultation",
            symptoms = "Palpitations",
            notes = null,
            consultationRoom = "OPD-302",
            queuePosition = 0,
            vitals = null
        )
    )

    private val mockStats = AppointmentQueueStats(
        total = 2,
        waiting = 1,
        inConsultation = 1,
        completed = 0,
        scheduled = 0,
        activeToken = 15
    )

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        coEvery {
            appointmentRepository.getTodayAppointments()
        } returns NetworkResult.Success(Pair(mockStats, mockAppointments))
        viewModel = AppointmentsViewModel(appointmentRepository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun fetchAppointments_populatesListAndStats() = runTest {
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals(2, viewModel.uiState.value.appointments.size)
        assertEquals(mockStats, viewModel.uiState.value.queueStats)
        assertFalse(viewModel.uiState.value.isLoading)
    }

    @Test
    fun filterAppointments_byStatus_filtersCorrectly() = runTest {
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.setFilter("WAITING")
        assertEquals(1, viewModel.uiState.value.filteredAppointments.size)
        assertEquals("Aarav Sharma", viewModel.uiState.value.filteredAppointments[0].patientName)

        viewModel.setFilter("IN_CONSULTATION")
        assertEquals(1, viewModel.uiState.value.filteredAppointments.size)
        assertEquals("Priya Patel", viewModel.uiState.value.filteredAppointments[0].patientName)
    }

    @Test
    fun searchAppointments_byQuery_filtersByNameOrUhid() = runTest {
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.setSearchQuery("Aarav")
        assertEquals(1, viewModel.uiState.value.filteredAppointments.size)
        assertEquals("Aarav Sharma", viewModel.uiState.value.filteredAppointments[0].patientName)

        viewModel.setSearchQuery("UHID-2026-0089")
        assertEquals(1, viewModel.uiState.value.filteredAppointments.size)
        assertEquals("Priya Patel", viewModel.uiState.value.filteredAppointments[0].patientName)
    }
}
