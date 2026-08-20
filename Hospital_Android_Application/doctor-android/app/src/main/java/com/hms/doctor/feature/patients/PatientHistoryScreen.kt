package com.hms.doctor.feature.patients

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Hotel
import androidx.compose.material.icons.filled.Science
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
import com.hms.doctor.domain.model.TimelineEvent

@Composable
fun PatientHistoryScreen(
    patientId: String,
    viewModel: PatientsViewModel,
    onNavigate: (String) -> Unit,
    onBackClick: () -> Unit
) {
    LaunchedEffect(patientId) {
        viewModel.loadPatientHistory(patientId)
    }

    val uiState by viewModel.uiState.collectAsState()
    val patient = uiState.selectedPatient
    var showReferralDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Patient EHR & History",
                showBackButton = true,
                onBackClick = onBackClick
            )
        }
    ) { paddingValues ->
        if (uiState.isHistoryLoading) {
            LoadingStateView(
                message = "Retrieving electronic health records...",
                modifier = Modifier.padding(paddingValues)
            )
        } else if (patient == null) {
            ErrorStateView(
                message = uiState.errorMessage ?: "Patient details not found.",
                onRetry = { viewModel.loadPatientHistory(patientId) },
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
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Patient Summary Header
                item {
                    HmsCard(
                        modifier = Modifier.fillMaxWidth(),
                        backgroundColor = HmsNavy,
                        elevation = 2.dp
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = patient.name,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = HmsSurface
                                )
                                Text(
                                    text = "${patient.uhid} • ${patient.age} yrs, ${patient.gender}",
                                    fontSize = 13.sp,
                                    color = HmsTealLight
                                )
                            }
                            StatusBadge(status = patient.status)
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        HorizontalDivider(color = HmsNavyLight)
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = "Blood Group", fontSize = 11.sp, color = HmsTextTertiary)
                                Text(text = patient.bloodGroup ?: "N/A", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = HmsSurface)
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = "Primary Condition", fontSize = 11.sp, color = HmsTextTertiary)
                                Text(text = patient.condition ?: "None", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = HmsSurface)
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = "Registered", fontSize = 11.sp, color = HmsTextTertiary)
                                Text(text = patient.registeredDate ?: "Recent", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = HmsSurface)
                            }
                        }

                        // Allergies & Chronic Conditions
                        if (!patient.allergies.isNullOrEmpty()) {
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = "Allergies: ${patient.allergies.joinToString(", ")}",
                                fontSize = 12.sp,
                                color = HmsDangerLight
                            )
                        }
                    }
                }

                // Action Bar
                item {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = {
                                onNavigate(
                                    Screen.NewPrescription.createRoute(
                                        patientId = patient.id,
                                        patientName = patient.name,
                                        uhid = patient.uhid,
                                        age = patient.age,
                                        gender = patient.gender
                                    )
                                )
                            },
                            modifier = Modifier.weight(1f).height(48.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = HmsBlue)
                        ) {
                            Text("Author Rx", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        }

                        Button(
                            onClick = { showReferralDialog = true },
                            modifier = Modifier.weight(1f).height(48.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = HmsNavy)
                        ) {
                            Text("Refer Hospital", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        }
                    }
                }

                // Timeline Section Header
                item {
                    Text(
                        text = "Clinical Medical History Timeline",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = HmsNavy
                    )
                }

                // Timeline Events
                if (uiState.timelineEvents.isEmpty()) {
                    item {
                        HmsCard(modifier = Modifier.fillMaxWidth()) {
                            Text(
                                text = "No prior consultation history on record for this patient.",
                                fontSize = 13.sp,
                                color = HmsTextSecondary
                            )
                        }
                    }
                } else {
                    items(uiState.timelineEvents, key = { it.id }) { event ->
                        TimelineEventItem(event = event)
                    }
                }
            }

            if (showReferralDialog) {
                com.hms.doctor.core.ui.components.HmsReferralDialog(
                    patientName = patient.name,
                    uhid = patient.uhid,
                    patientAge = patient.age,
                    patientGender = patient.gender,
                    diagnosis = patient.condition ?: "Cardiovascular Consultation",
                    vitalsSummary = "BP: 138/88 mmHg • HR: 78 BPM • SpO2: 98%",
                    onDismiss = { showReferralDialog = false },
                    onReferralDispatched = {
                        showReferralDialog = false
                    }
                )
            }
        }
    }
}

@Composable
fun TimelineEventItem(event: TimelineEvent) {
    val (icon, color) = when (event.eventType.uppercase()) {
        "CONSULTATION" -> Pair(Icons.Default.Event, HmsBlue)
        "PRESCRIPTION" -> Pair(Icons.Default.Edit, HmsTeal)
        "LAB_REPORT", "REPORT" -> Pair(Icons.Default.Science, HmsWarning)
        "ADMISSION" -> Pair(Icons.Default.Hotel, HmsNavy)
        else -> Pair(Icons.Default.Description, HmsBlue)
    }

    HmsCard(
        modifier = Modifier.fillMaxWidth(),
        elevation = 1.dp
    ) {
        Row(modifier = Modifier.fillMaxWidth()) {
            Surface(
                shape = CircleShape,
                color = color.copy(alpha = 0.12f),
                modifier = Modifier.size(40.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = icon,
                        contentDescription = event.eventType,
                        tint = color,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = event.title,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = HmsNavy
                    )
                    Text(
                        text = event.timestamp.split("T").firstOrNull() ?: event.timestamp,
                        fontSize = 11.sp,
                        color = HmsTextSecondary
                    )
                }

                if (!event.description.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = event.description,
                        fontSize = 12.sp,
                        color = HmsTextPrimary
                    )
                }

                if (!event.doctorName.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Doctor: ${event.doctorName} (${event.department ?: "Clinical"})",
                        fontSize = 11.sp,
                        color = HmsTextSecondary
                    )
                }
            }
        }
    }
}
