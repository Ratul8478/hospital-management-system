package com.hms.doctor.core.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.navArgument
import com.hms.doctor.core.ui.theme.*
import com.hms.doctor.feature.admissions.AdmissionsScreen
import com.hms.doctor.feature.admissions.AdmissionsViewModel
import com.hms.doctor.feature.appointments.AppointmentDetailScreen
import com.hms.doctor.feature.appointments.AppointmentsScreen
import com.hms.doctor.feature.appointments.AppointmentsViewModel
import com.hms.doctor.feature.auth.LoginScreen
import com.hms.doctor.feature.auth.LoginViewModel
import com.hms.doctor.feature.earnings.EarningsScreen
import com.hms.doctor.feature.earnings.EarningsViewModel
import com.hms.doctor.feature.followups.FollowUpsScreen
import com.hms.doctor.feature.followups.FollowUpsViewModel
import com.hms.doctor.feature.home.HomeScreen
import com.hms.doctor.feature.home.HomeViewModel
import com.hms.doctor.feature.notifications.NotificationsScreen
import com.hms.doctor.feature.notifications.NotificationsViewModel
import com.hms.doctor.feature.patients.PatientHistoryScreen
import com.hms.doctor.feature.patients.PatientSearchScreen
import com.hms.doctor.feature.patients.PatientsViewModel
import com.hms.doctor.feature.prescriptions.NewPrescriptionScreen
import com.hms.doctor.feature.prescriptions.PrescriptionViewModel
import com.hms.doctor.feature.prescriptions.PrescriptionsListScreen
import com.hms.doctor.feature.profile.ProfileScreen
import com.hms.doctor.feature.profile.ProfileViewModel
import com.hms.doctor.feature.reports.ReportsScreen
import com.hms.doctor.feature.reports.ReportsViewModel

@Composable
fun HmsMainScreen(
    navController: NavHostController,
    isLoggedIn: Boolean
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val showBottomBar = currentRoute in listOf(
        Screen.Home.route,
        Screen.Appointments.route,
        Screen.Patients.route,
        Screen.Reports.route,
        Screen.Profile.route
    )

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(
                    containerColor = HmsSurface,
                    contentColor = HmsNavy
                ) {
                    bottomNavItems.forEach { item ->
                        val selected = currentRoute == item.route
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(item.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = {
                                Icon(
                                    imageVector = item.icon,
                                    contentDescription = item.title
                                )
                            },
                            label = { Text(item.title) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = HmsBlue,
                                selectedTextColor = HmsBlue,
                                unselectedIconColor = HmsTextSecondary,
                                unselectedTextColor = HmsTextSecondary,
                                indicatorColor = HmsBlueSubtle
                            )
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = if (isLoggedIn) Screen.Home.route else Screen.Login.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            // Auth Flow
            composable(Screen.Login.route) {
                val viewModel: LoginViewModel = hiltViewModel()
                LoginScreen(
                    viewModel = viewModel,
                    onLoginSuccess = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    }
                )
            }

            // Primary Bottom Nav Screens
            composable(Screen.Home.route) {
                val viewModel: HomeViewModel = hiltViewModel()
                HomeScreen(
                    viewModel = viewModel,
                    onNavigate = { route -> navController.navigate(route) }
                )
            }

            composable(Screen.Appointments.route) {
                val viewModel: AppointmentsViewModel = hiltViewModel()
                AppointmentsScreen(
                    viewModel = viewModel,
                    onNavigate = { route -> navController.navigate(route) }
                )
            }

            composable(Screen.Patients.route) {
                val viewModel: PatientsViewModel = hiltViewModel()
                PatientSearchScreen(
                    viewModel = viewModel,
                    onNavigate = { route -> navController.navigate(route) }
                )
            }

            composable(Screen.Reports.route) {
                val viewModel: ReportsViewModel = hiltViewModel()
                ReportsScreen(
                    viewModel = viewModel,
                    onNavigate = { route -> navController.navigate(route) }
                )
            }

            composable(Screen.Profile.route) {
                val viewModel: ProfileViewModel = hiltViewModel()
                ProfileScreen(
                    viewModel = viewModel,
                    onLogoutSuccess = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }

            // Secondary Detail Screens
            composable(
                route = Screen.AppointmentDetail.route,
                arguments = listOf(navArgument("appointmentId") { type = NavType.IntType })
            ) { backStackEntry ->
                val appointmentId = backStackEntry.arguments?.getInt("appointmentId") ?: 0
                val viewModel: AppointmentsViewModel = hiltViewModel()
                AppointmentDetailScreen(
                    appointmentId = appointmentId,
                    viewModel = viewModel,
                    onNavigate = { route -> navController.navigate(route) },
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable(
                route = Screen.PatientHistory.route,
                arguments = listOf(navArgument("patientId") { type = NavType.StringType })
            ) { backStackEntry ->
                val patientId = backStackEntry.arguments?.getString("patientId") ?: ""
                val viewModel: PatientsViewModel = hiltViewModel()
                PatientHistoryScreen(
                    patientId = patientId,
                    viewModel = viewModel,
                    onNavigate = { route -> navController.navigate(route) },
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable(
                route = Screen.NewPrescription.route,
                arguments = listOf(
                    navArgument("appointmentId") { type = NavType.IntType; defaultValue = 0 },
                    navArgument("patientId") { type = NavType.IntType; defaultValue = 0 },
                    navArgument("patientName") { type = NavType.StringType; defaultValue = "" },
                    navArgument("uhid") { type = NavType.StringType; defaultValue = "" },
                    navArgument("age") { type = NavType.IntType; defaultValue = 40 },
                    navArgument("gender") { type = NavType.StringType; defaultValue = "Male" }
                )
            ) { backStackEntry ->
                val apptId = backStackEntry.arguments?.getInt("appointmentId")
                val patientId = backStackEntry.arguments?.getInt("patientId") ?: 0
                val patientName = backStackEntry.arguments?.getString("patientName") ?: ""
                val uhid = backStackEntry.arguments?.getString("uhid") ?: ""
                val age = backStackEntry.arguments?.getInt("age") ?: 40
                val gender = backStackEntry.arguments?.getString("gender") ?: "Male"

                val viewModel: PrescriptionViewModel = hiltViewModel()
                NewPrescriptionScreen(
                    appointmentId = if (apptId == 0) null else apptId,
                    patientId = patientId,
                    patientName = patientName,
                    uhid = uhid,
                    age = age,
                    gender = gender,
                    viewModel = viewModel,
                    onSuccessBack = { navController.popBackStack() },
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable(Screen.PrescriptionsList.route) {
                val viewModel: PrescriptionViewModel = hiltViewModel()
                PrescriptionsListScreen(
                    viewModel = viewModel,
                    onNavigate = { route -> navController.navigate(route) }
                )
            }

            composable(Screen.Admissions.route) {
                val viewModel: AdmissionsViewModel = hiltViewModel()
                AdmissionsScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable(Screen.FollowUps.route) {
                val viewModel: FollowUpsViewModel = hiltViewModel()
                FollowUpsScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable(Screen.Earnings.route) {
                val viewModel: EarningsViewModel = hiltViewModel()
                EarningsScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }

            composable(Screen.Notifications.route) {
                val viewModel: NotificationsViewModel = hiltViewModel()
                NotificationsScreen(
                    viewModel = viewModel,
                    onBackClick = { navController.popBackStack() }
                )
            }
        }
    }
}
