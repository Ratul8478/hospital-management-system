package com.hms.doctor.feature.home

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.navigation.Screen
import com.hms.doctor.core.ui.components.*
import com.hms.doctor.core.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigate: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "HMS Doctor",
                notificationCount = uiState.pendingReportsCount,
                onNotificationClick = { onNavigate(Screen.Notifications.route) }
            )
        }
    ) { paddingValues ->
        if (uiState.isLoading && !uiState.isRefreshing) {
            LoadingStateView(modifier = Modifier.padding(paddingValues))
        } else if (uiState.errorMessage != null && uiState.todayAppointments.isEmpty()) {
            ErrorStateView(
                message = uiState.errorMessage!!,
                onRetry = { viewModel.loadDashboardData() },
                isNetworkError = uiState.isNetworkError,
                modifier = Modifier.padding(paddingValues)
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .background(HmsBackground)
                    .padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // 1. LIVE ANIMATED CLINICAL TICKER
                item {
                    LiveAnimatedHospitalTicker()
                }

                // 2. Physician Hero Card (Deep Medical Gradient)
                item {
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(20.dp),
                        color = HmsNavy,
                        shadowElevation = 4.dp
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Surface(
                                    modifier = Modifier.size(56.dp),
                                    shape = CircleShape,
                                    color = HmsBlueLight
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(
                                            text = "Dr",
                                            fontSize = 20.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = HmsSurface
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.width(14.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = uiState.doctorName.ifBlank { "Dr. Sarah Williams" },
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = HmsSurface
                                    )
                                    Text(
                                        text = "${uiState.specialty.ifBlank { "Cardiologist" }} • OPD Suite 302",
                                        fontSize = 13.sp,
                                        color = HmsTealLight
                                    )
                                }
                                StatusBadge(status = uiState.dutyStatus)
                            }
                            Spacer(modifier = Modifier.height(12.dp))
                            HorizontalDivider(color = HmsNavyLight)
                            Spacer(modifier = Modifier.height(10.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "Medix Central Hospital",
                                    fontSize = 12.sp,
                                    color = HmsSurface.copy(alpha = 0.8f)
                                )
                                Text(
                                    text = "Campus: Main Wing A",
                                    fontSize = 12.sp,
                                    color = HmsTealLight
                                )
                            }
                        }
                    }
                }

                // 3. ANIMATED HORIZONTAL PATIENT QUEUE CAROUSEL
                item {
                    Text(
                        text = "Live Priority Queue Stream",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = HmsNavy
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    AnimatedPatientCarousel(
                        appointments = uiState.todayAppointments,
                        onPatientClick = { apptId ->
                            onNavigate(Screen.AppointmentDetail.createRoute(apptId))
                        }
                    )
                }

                // 4. Live OPD Queue Metrics
                item {
                    Text(
                        text = "Today's OPD Metrics",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = HmsNavy
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        QueueStatCard(
                            title = "Total",
                            count = uiState.queueStats?.total ?: 0,
                            color = HmsNavy,
                            bgColor = HmsSurface,
                            modifier = Modifier.weight(1f)
                        )
                        QueueStatCard(
                            title = "In Consult",
                            count = uiState.queueStats?.inConsultation ?: 0,
                            color = HmsBlue,
                            bgColor = HmsBlueSubtle,
                            modifier = Modifier.weight(1f)
                        )
                        QueueStatCard(
                            title = "Waiting",
                            count = uiState.queueStats?.waiting ?: 0,
                            color = HmsWarningDark,
                            bgColor = HmsWarningSubtle,
                            modifier = Modifier.weight(1f)
                        )
                        QueueStatCard(
                            title = "Done",
                            count = uiState.queueStats?.completed ?: 0,
                            color = HmsSuccessDark,
                            bgColor = HmsSuccessSubtle,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // 5. Next Patient Highlight Priority Card
                item {
                    val patient = uiState.nextPatient
                    if (patient != null) {
                        Text(
                            text = if (patient.status.equals("In Consultation", ignoreCase = true)) "Current Active Patient" else "Next Patient in Queue",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = HmsNavy
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        HmsCard(
                            modifier = Modifier.fillMaxWidth(),
                            borderColor = HmsBlue.copy(alpha = 0.35f),
                            elevation = 2.dp,
                            innerPadding = 18.dp
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = HmsBlue
                                ) {
                                    Text(
                                        text = "TOKEN #${patient.tokenNumber}",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = HmsSurface,
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                                    )
                                }
                                StatusBadge(status = patient.status)
                            }

                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = patient.patientName,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = HmsTextPrimary
                            )
                            Text(
                                text = "${patient.uhid} • ${patient.patientAge} yrs, ${patient.patientGender ?: "Unspecified"}",
                                fontSize = 13.sp,
                                color = HmsTextSecondary
                            )

                            if (!patient.symptoms.isNullOrBlank()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = HmsSurfaceVariant,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = "Symptoms: ${patient.symptoms}",
                                        fontSize = 12.sp,
                                        color = HmsTextPrimary,
                                        modifier = Modifier.padding(10.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                if (patient.status.equals("Waiting", ignoreCase = true)) {
                                    Button(
                                        onClick = {
                                            viewModel.startConsultation(patient.id) {
                                                onNavigate(Screen.AppointmentDetail.createRoute(patient.id))
                                            }
                                        },
                                        modifier = Modifier.weight(1.2f).height(42.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = HmsBlue),
                                        shape = RoundedCornerShape(10.dp)
                                    ) {
                                        Icon(imageVector = Icons.Default.HeadsetMic, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Call", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                                OutlinedButton(
                                    onClick = { onNavigate(Screen.AppointmentDetail.createRoute(patient.id)) },
                                    modifier = Modifier.weight(1f).height(42.dp),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text("Chart", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                }
                                Button(
                                    onClick = {
                                        onNavigate(
                                            Screen.NewPrescription.createRoute(
                                                appointmentId = patient.id,
                                                patientId = patient.patientId,
                                                patientName = patient.patientName,
                                                uhid = patient.uhid,
                                                age = patient.patientAge,
                                                gender = patient.patientGender ?: "Male"
                                            )
                                        )
                                    },
                                    modifier = Modifier.weight(1.1f).height(42.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = HmsSuccess),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("New Rx", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }

                // 6. Clinical Quick Actions Grid
                item {
                    Text(
                        text = "Clinical Quick Actions",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = HmsNavy
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        QuickActionTile(
                            title = "OPD Queue",
                            icon = Icons.Default.CalendarMonth,
                            color = HmsBlue,
                            onClick = { onNavigate(Screen.Appointments.route) },
                            modifier = Modifier.weight(1f)
                        )
                        QuickActionTile(
                            title = "Search EHR",
                            icon = Icons.Default.Search,
                            color = HmsTeal,
                            onClick = { onNavigate(Screen.Patients.route) },
                            modifier = Modifier.weight(1f)
                        )
                        QuickActionTile(
                            title = "Lab Reports",
                            icon = Icons.Default.Science,
                            color = HmsWarningDark,
                            onClick = { onNavigate(Screen.Reports.route) },
                            modifier = Modifier.weight(1f)
                        )
                        QuickActionTile(
                            title = "Inpatients",
                            icon = Icons.Default.Hotel,
                            color = HmsNavy,
                            onClick = { onNavigate(Screen.Admissions.route) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // 7. Earnings Widget Card
                item {
                    val earn = uiState.earnings
                    if (earn != null) {
                        HmsCard(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { onNavigate(Screen.Earnings.route) },
                            backgroundColor = HmsSuccessSubtle,
                            borderColor = HmsSuccess.copy(alpha = 0.3f),
                            innerPadding = 18.dp
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "Today's Consultation Revenue",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = HmsSuccessDark
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "${earn.currency}${earn.todayEarnings}",
                                        fontSize = 24.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = HmsNavy
                                    )
                                }
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = HmsSuccess
                                ) {
                                    Text(
                                        text = "${earn.todayConsultations} Consults",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = HmsSurface,
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * 🌟 LIVE ANIMATED CLINICAL TICKER
 * Automatically cycles through emergency alerts, queue calls, and hospital announcements.
 */
@Composable
fun LiveAnimatedHospitalTicker() {
    val tickerMessages = listOf(
        "🚨 Critical Lab Alert: Lipid Profile ready for Aarav Sharma (UHID-0042)",
        "⚡ OPD Token #15 Priya Patel currently in Consultation (Room 302)",
        "🏥 Inpatient Bed ICU-02 status updated by Nurse Shalini",
        "🩺 Emergency Cath Lab 2 available for Cardiology urgent admissions"
    )

    var currentIndex by remember { mutableIntStateOf(0) }

    LaunchedEffect(Unit) {
        while (true) {
            delay(3500)
            currentIndex = (currentIndex + 1) % tickerMessages.size
        }
    }

    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        color = HmsNavy,
        border = androidx.compose.foundation.BorderStroke(1.dp, HmsTeal.copy(alpha = 0.3f)),
        shadowElevation = 2.dp
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = RoundedCornerShape(6.dp),
                color = HmsDanger
            ) {
                Text(
                    text = "LIVE",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsSurface,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
            Spacer(modifier = Modifier.width(8.dp))
            AnimatedContent(
                targetState = tickerMessages[currentIndex],
                transitionSpec = {
                    slideInVertically { height -> height } + fadeIn() togetherWith
                            slideOutVertically { height -> -height } + fadeOut()
                },
                label = "tickerAnimation"
            ) { message ->
                Text(
                    text = message,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = HmsSurface,
                    maxLines = 1
                )
            }
        }
    }
}

/**
 * 🌟 ANIMATED HORIZONTAL PATIENT QUEUE CAROUSEL
 */
@Composable
fun AnimatedPatientCarousel(
    appointments: List<com.hms.doctor.domain.model.Appointment>,
    onPatientClick: (Int) -> Unit
) {
    if (appointments.isEmpty()) return

    val listState = rememberLazyListState()

    LazyRow(
        state = listState,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(horizontal = 2.dp)
    ) {
        items(appointments.take(6), key = { it.id }) { appt ->
            Surface(
                onClick = { onPatientClick(appt.id) },
                modifier = Modifier
                    .width(220.dp)
                    .height(115.dp),
                shape = RoundedCornerShape(16.dp),
                color = HmsSurface,
                border = androidx.compose.foundation.BorderStroke(1.dp, HmsBorder),
                shadowElevation = 2.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = HmsNavy
                        ) {
                            Text(
                                text = "#${appt.tokenNumber}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HmsSurface,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                        StatusBadge(status = appt.status)
                    }

                    Column {
                        Text(
                            text = appt.patientName,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = HmsTextPrimary,
                            maxLines = 1
                        )
                        Text(
                            text = "${appt.uhid} • ${appt.appointmentTime ?: "10:00 AM"}",
                            fontSize = 11.sp,
                            color = HmsTextSecondary
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun QueueStatCard(
    title: String,
    count: Int,
    color: Color,
    bgColor: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.height(72.dp),
        shape = RoundedCornerShape(12.dp),
        color = bgColor,
        border = androidx.compose.foundation.BorderStroke(1.dp, HmsBorder)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = count.toString(),
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Text(
                text = title,
                fontSize = 11.sp,
                color = HmsTextSecondary,
                maxLines = 1
            )
        }
    }
}

@Composable
fun QuickActionTile(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        modifier = modifier.height(76.dp),
        shape = RoundedCornerShape(12.dp),
        color = HmsSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, HmsBorder),
        shadowElevation = 1.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = color,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = title,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = HmsTextPrimary,
                maxLines = 1
            )
        }
    }
}
