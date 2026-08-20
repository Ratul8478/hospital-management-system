package com.hms.doctor.auth

import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.DoctorUser
import com.hms.doctor.domain.repository.AuthRepository
import com.hms.doctor.feature.auth.LoginViewModel
import io.mockk.coEvery
import io.mockk.coVerify
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
class LoginViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private val authRepository: AuthRepository = mockk(relaxed = true)
    private lateinit var viewModel: LoginViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        viewModel = LoginViewModel(authRepository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun login_withValidCredentials_successStateUpdated() = runTest {
        val mockUser = DoctorUser(
            id = 1,
            name = "Dr. Sarah Williams",
            email = "sarah.williams@medix.com",
            phone = "+91 98200 11223",
            specialty = "Cardiologist",
            department = "Cardiology",
            qualification = "MD, DM",
            registrationNumber = "NMC-1234",
            branchId = 1,
            branchCode = "MEDIX-MAIN",
            branchName = "Main Campus",
            fee = 1500.0,
            status = "AVAILABLE",
            role = "doctor",
            avatarUrl = null
        )

        coEvery {
            authRepository.login("sarah.williams@medix.com", "Doctor@123")
        } returns NetworkResult.Success(mockUser)

        var successCallbackCalled = false
        viewModel.onEmailChanged("sarah.williams@medix.com")
        viewModel.onPasswordChanged("Doctor@123")
        viewModel.login { successCallbackCalled = true }

        testDispatcher.scheduler.advanceUntilIdle()

        assertTrue(successCallbackCalled)
        assertEquals(mockUser, viewModel.uiState.value.loggedInUser)
        assertFalse(viewModel.uiState.value.isLoading)
        assertNull(viewModel.uiState.value.errorMessage)
    }

    @Test
    fun login_withEmptyEmail_showsValidationError() = runTest {
        viewModel.onEmailChanged("")
        var successCallbackCalled = false
        viewModel.login { successCallbackCalled = true }

        assertFalse(successCallbackCalled)
        assertNotNull(viewModel.uiState.value.errorMessage)
        coVerify(exactly = 0) { authRepository.login(any(), any()) }
    }

    @Test
    fun login_whenApiReturnsError_showsServerErrorMessage() = runTest {
        coEvery {
            authRepository.login(any(), any())
        } returns NetworkResult.Error("Invalid doctor credentials", statusCode = 401)

        viewModel.onEmailChanged("invalid@medix.com")
        viewModel.onPasswordChanged("wrongpass")
        viewModel.login {}

        testDispatcher.scheduler.advanceUntilIdle()

        assertFalse(viewModel.uiState.value.isLoading)
        assertEquals("Invalid doctor credentials", viewModel.uiState.value.errorMessage)
    }
}
