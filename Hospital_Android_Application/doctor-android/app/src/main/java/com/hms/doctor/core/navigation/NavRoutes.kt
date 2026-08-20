package com.hms.doctor.core.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Person
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Home : Screen("home")
    object Appointments : Screen("appointments")
    object AppointmentDetail : Screen("appointment_detail/{appointmentId}") {
        fun createRoute(appointmentId: Int) = "appointment_detail/$appointmentId"
    }
    object Patients : Screen("patients")
    object PatientDetail : Screen("patient_detail/{patientId}") {
        fun createRoute(patientId: Int) = "patient_detail/$patientId"
    }
    object PatientHistory : Screen("patient_history/{patientId}") {
        fun createRoute(patientId: Int) = "patient_history/$patientId"
    }
    object Reports : Screen("reports")
    object PrescriptionsList : Screen("prescriptions_list")
    object NewPrescription : Screen("new_prescription?appointmentId={appointmentId}&patientId={patientId}&patientName={patientName}&uhid={uhid}&age={age}&gender={gender}") {
        fun createRoute(
            appointmentId: Int? = null,
            patientId: Int? = null,
            patientName: String = "",
            uhid: String = "",
            age: Int = 40,
            gender: String = "Male"
        ): String {
            return "new_prescription?appointmentId=${appointmentId ?: 0}&patientId=${patientId ?: 0}&patientName=$patientName&uhid=$uhid&age=$age&gender=$gender"
        }
    }
    object Admissions : Screen("admissions")
    object FollowUps : Screen("followups")
    object Earnings : Screen("earnings")
    object Profile : Screen("profile")
    object Notifications : Screen("notifications")
}

data class BottomNavItem(
    val title: String,
    val route: String,
    val icon: ImageVector
)

val bottomNavItems = listOf(
    BottomNavItem("Home", Screen.Home.route, Icons.Default.Home),
    BottomNavItem("OPD Queue", Screen.Appointments.route, Icons.Default.CalendarMonth),
    BottomNavItem("Patients", Screen.Patients.route, Icons.Default.People),
    BottomNavItem("Reports", Screen.Reports.route, Icons.Default.Description),
    BottomNavItem("Profile", Screen.Profile.route, Icons.Default.Person)
)
