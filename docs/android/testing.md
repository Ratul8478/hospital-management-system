# Medix Doctor Android: QA & Testing Strategy

**QA Standard:** Multi-Tiered Test Automation (Unit, Integration, Compose UI & Cross-Platform Sync)  
**Test Frameworks:** JUnit 4/5, MockK 1.13.10, Turbine 1.1.0, Coroutines Test 1.8.1, Compose UI Test  
**Coverage Target:** > 80% Line Coverage on Domain Use Cases & Data Repositories  

---

## 1. Quality Assurance & Test Pyramid Overview

The Medix Android Doctor application follows a disciplined, multi-tiered test strategy designed to guarantee clinical precision, data integrity, and zero regression during rapid deployment cycles:

```
                  ┌──────────────────────┐
                  │   E2E & Sync Tests   │  (10%)
                  │ Web <-> Android Flow │
                  ├──────────────────────┤
                  │   Compose UI Tests   │  (20%)
                  │ State & Accessibility│
                  ├──────────────────────┤
                  │  Integration Tests   │  (30%)
                  │ Room DB, OkHttp/Mock │
                  ├──────────────────────┤
                  │   Unit Test Suite    │  (40%)
                  │ ViewModels, UseCases │
                  └──────────────────────┘
```

---

## 2. Unit Testing Suite

### 2.1 Testing Domain Use Cases
Domain use cases represent pure clinical business logic and are tested in complete isolation using MockK.

#### Test Example: `RecordPatientVitalsUseCaseTest`
```kotlin
package com.medix.doctor.domain.usecase

import com.medix.doctor.domain.model.VitalSign
import com.medix.doctor.domain.repository.PatientRepository
import com.medix.doctor.domain.util.Resource
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class RecordPatientVitalsUseCaseTest {

    private lateinit var patientRepository: PatientRepository
    private lateinit var recordPatientVitalsUseCase: RecordPatientVitalsUseCase

    @Before
    fun setUp() {
        patientRepository = mockk()
        recordPatientVitalsUseCase = RecordPatientVitalsUseCase(patientRepository)
    }

    @Test
    fun `when systolic BP is above biological threshold then return validation error without calling repository`() = runTest {
        // Arrange
        val invalidVitals = VitalSign(
            patientId = 401L,
            bpSystolic = 320, // Exceeds upper limit of 260 mmHg
            bpDiastolic = 85,
            recordedAt = "2026-08-16T12:00:00Z"
        )

        // Act
        val result = recordPatientVitalsUseCase("UHID-2026-0042", invalidVitals)

        // Assert
        assertTrue(result is Resource.Error)
        assertEquals("Invalid systolic blood pressure reading", result.message)
        coVerify(exactly = 0) { patientRepository.recordVitals(any(), any()) }
    }

    @Test
    fun `when vitals are valid then call repository and return success`() = runTest {
        // Arrange
        val validVitals = VitalSign(
            patientId = 401L,
            bpSystolic = 120,
            bpDiastolic = 80,
            heartRateBpm = 72,
            spO2Percentage = 99,
            temperatureCelsius = 36.6,
            recordedAt = "2026-08-16T12:00:00Z"
        )
        coEvery { patientRepository.recordVitals("UHID-2026-0042", validVitals) } returns Resource.Success(validVitals)

        // Act
        val result = recordPatientVitalsUseCase("UHID-2026-0042", validVitals)

        // Assert
        assertTrue(result is Resource.Success)
        assertEquals(120, result.data?.bpSystolic)
        coVerify(exactly = 1) { patientRepository.recordVitals("UHID-2026-0042", validVitals) }
    }
}
```

---

### 2.2 Testing ViewModels with Coroutine Turbine
ViewModels expose `StateFlow<UiState>`. Turbine is utilized to assert state transitions sequentially (Loading -> Success/Error).

#### Test Example: `AppointmentQueueViewModelTest`
```kotlin
package com.medix.doctor.ui.queue

import app.cash.turbine.test
import com.medix.doctor.domain.model.Appointment
import com.medix.doctor.domain.model.AppointmentStatus
import com.medix.doctor.domain.model.AppointmentType
import com.medix.doctor.domain.usecase.GetTodayQueueUseCase
import com.medix.doctor.domain.usecase.UpdateAppointmentStatusUseCase
import com.medix.doctor.domain.util.Resource
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AppointmentQueueViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var getTodayQueueUseCase: GetTodayQueueUseCase
    private lateinit var updateStatusUseCase: UpdateAppointmentStatusUseCase
    private lateinit var viewModel: AppointmentQueueViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        getTodayQueueUseCase = mockk()
        updateStatusUseCase = mockk()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `loadQueue emits Loading then Success with populated appointments`() = runTest {
        // Arrange
        val mockAppointments = listOf(
            Appointment(
                id = 101L,
                branchId = 1L,
                patientName = "Aarav Sharma",
                uhid = "UHID-2026-0042",
                doctorName = "Dr. Sarah Jenkins",
                department = "Cardiology",
                appointmentDate = "2026-08-16",
                appointmentTime = "10:30 AM",
                tokenNumber = 14,
                type = AppointmentType.OPD,
                status = AppointmentStatus.WAITING
            )
        )
        coEvery { getTodayQueueUseCase(any()) } returns Resource.Success(mockAppointments)

        // Act
        viewModel = AppointmentQueueViewModel(getTodayQueueUseCase, updateStatusUseCase)

        // Assert with Turbine
        viewModel.uiState.test {
            val initialState = awaitItem()
            // Step through initial emission
            testDispatcher.scheduler.advanceUntilIdle()
            
            val successState = awaitItem()
            assertFalse(successState.isLoading)
            assertEquals(1, successState.appointments.size)
            assertEquals("Aarav Sharma", successState.appointments[0].patientName)
        }
    }
}
```

---

## 3. Local Database & Integration Testing

Room DAO tests verify that SQLite queries, transactions, conflicts, and indexing work accurately on an in-memory SQLite database.

```kotlin
@RunWith(AndroidJUnit4::class)
class AppointmentDaoTest {

    private lateinit var db: MedixDatabase
    private lateinit var appointmentDao: AppointmentDao

    @Before
    fun createDb() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(context, MedixDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        appointmentDao = db.appointmentDao()
    }

    @After
    fun closeDb() {
        db.close()
    }

    @Test
    fun insertAndRetrieveAppointmentByBranchId() = runTest {
        val entity = AppointmentEntity(
            id = 101L,
            branchId = 1L,
            patientName = "Aarav Sharma",
            uhid = "UHID-2026-0042",
            status = "WAITING"
        )
        appointmentDao.insertAppointments(listOf(entity))

        val flow = appointmentDao.getAppointmentsForBranch(1L)
        val result = flow.first()

        assertEquals(1, result.size)
        assertEquals("UHID-2026-0042", result[0].uhid)
    }
}
```

---

## 4. Jetpack Compose UI Testing

Compose UI tests verify user interactions, accessibility semantics, and error rendering.

```kotlin
@RunWith(AndroidJUnit4::class)
class QueueScreenComposeTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun queueScreen_displaysPatientCard_and_callsPatientOnButtonClick() {
        var callClicked = false

        composeTestRule.setContent {
            MedixTheme {
                PatientQueueCard(
                    patientName = "Aarav Sharma",
                    tokenNumber = 14,
                    uhid = "UHID-2026-0042",
                    status = AppointmentStatus.WAITING,
                    onCallPatient = { callClicked = true }
                )
            }
        }

        // Verify patient name and token displayed
        composeTestRule.onNodeWithText("Aarav Sharma").assertIsDisplayed()
        composeTestRule.onNodeWithText("Token #14").assertIsDisplayed()

        // Perform click on Call Action
        composeTestRule.onNodeWithText("Call Patient").performClick()
        assertTrue(callClicked)
    }
}
```

---

## 5. Cross-Platform Web <-> Android Synchronization Scenarios

The Medix system synchronizes state seamlessly between the Web Management Portal and the Android Doctor companion app. The following cross-platform end-to-end scenarios must be verified during each sprint:

### Scenario 1: Web Booking -> Mobile Queue Real-Time Appearance
- **Trigger:** Receptionist on Web Portal books an OPD appointment for patient `UHID-2026-0042` with `Dr. Sarah Jenkins` at `MEDIX-MAIN (Mumbai)`.
- **Expected Outcome:**
  1. Appointment record is written to backend database with `tokenNumber: 14` and `status: WAITING`.
  2. WebSocket / FCM push alert delivers payload to Android Doctor app.
  3. Doctor's queue screen on Android automatically increments waiting count by +1 and renders patient card with badge `WAITING` without requiring manual swipe-to-refresh.

---

### Scenario 2: Android Token Progression -> Web Waiting Screen & Patient Portal
- **Trigger:** Doctor on Android app taps **"Call Patient (Token 14)"** and changes status to **"In Consultation"**.
- **Expected Outcome:**
  1. Android app issues `PATCH /api/v1/doctor/appointments/101/status` with `IN_CONSULTATION`.
  2. Web Waiting Room Display instantly flashes *"Token #14 (Aarav Sharma) - Please proceed to OPD Room 302"*.
  3. Receptionist Dashboard on Web marks the doctor status as `BUSY` and patient status as `In Consultation`.

---

### Scenario 3: Bedside Vitals Logged on Android -> Web EHR Telemetry Sync
- **Trigger:** Doctor at patient bedside enters BP `145/95 mmHg`, SpO2 `94%`, HR `98 bpm` into the Android app.
- **Expected Outcome:**
  1. Android app flags record as `isAbnormal = true` (elevated systolic & borderline SpO2) and sends `POST /api/v1/patients/UHID-2026-0042/vitals`.
  2. Web Clinical EHR dashboard immediately plots new point on the Patient Vital Signs Chart with an amber warning icon.
  3. Branch Admin dashboard updates bed telemetry and health score index in real time.

---

### Scenario 4: Offline Resilience & Reconnection Conflict Resolution
- **Trigger:** Doctor writes a clinical prescription and completes consultation while in an elevator or shielded radiology zone (Zero network connectivity).
- **Expected Outcome:**
  1. Android app saves consultation note and prescription into local Room DB marked as `syncState = PENDING_UPLOAD`.
  2. App displays an amber sync badge: *"Saved locally (Offline)"*.
  3. Once network connectivity is restored (Android `ConnectivityManager` emits `NetworkCapabilities.NET_CAPABILITY_INTERNET`), background `WorkManager` worker automatically triggers idempotent batch sync.
  4. Web portal receives and confirms the prescription without duplicate entries or data corruption.

---

## 6. Continuous Integration (CI) Workflow

All tests run automatically on every pull request via GitHub Actions:

```yaml
name: Android CI & Quality Gate

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Grant Execute Permission to Gradlew
        run: chmod +x android-doctor/gradlew

      - name: Run Unit Tests & Lint
        run: |
          cd android-doctor
          ./gradlew testDebugUnitTest lintDebug

      - name: Upload Test Results
        uses: actions/upload-artifact@v4
        with:
          name: test-reports
          path: android-doctor/app/build/reports/tests/
```
