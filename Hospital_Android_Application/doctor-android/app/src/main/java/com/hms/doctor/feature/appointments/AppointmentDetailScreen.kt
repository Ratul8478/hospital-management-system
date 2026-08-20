package com.hms.doctor.feature.appointments

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.navigation.Screen
import com.hms.doctor.core.ui.components.*
import com.hms.doctor.core.ui.theme.*

@Composable
fun AppointmentDetailScreen(
    appointmentId: Int,
    viewModel: AppointmentsViewModel,
    onNavigate: (String) -> Unit,
    onBackClick: () -> Unit
) {
    LaunchedEffect(appointmentId) {
        viewModel.selectAppointmentById(appointmentId)
    }

    val uiState by viewModel.uiState.collectAsState()
    val appointment = uiState.selectedAppointment
    val scrollState = rememberScrollState()
    var showReferralDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Appointment #${appointment?.tokenNumber ?: ""}",
                showBackButton = true,
                onBackClick = onBackClick
            )
        }
    ) { paddingValues ->
        if (appointment == null) {
            LoadingStateView(
                message = "Loading appointment details...",
                modifier = Modifier.padding(paddingValues)
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(HmsBackground)
                    .padding(paddingValues)
                    .verticalScroll(scrollState)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header Card
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
                                text = "Token #${appointment.tokenNumber}",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = HmsSurface
                            )
                            Text(
                                text = "Scheduled: ${appointment.appointmentTime} • ${appointment.appointmentDate}",
                                fontSize = 12.sp,
                                color = HmsTealLight
                            )
                        }
                        StatusBadge(status = appointment.status)
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    HorizontalDivider(color = HmsNavyLight)
                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = appointment.patientName,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = HmsSurface
                    )
                    Text(
                        text = "${appointment.uhid} • ${appointment.patientAge} yrs, ${appointment.patientGender ?: "Unspecified"}",
                        fontSize = 13.sp,
                        color = HmsSurface.copy(alpha = 0.9f)
                    )
                    if (!appointment.patientPhone.isNullOrBlank()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Phone,
                                contentDescription = "Phone",
                                tint = HmsTealLight,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = appointment.patientPhone,
                                fontSize = 12.sp,
                                color = HmsTealLight
                            )
                        }
                    }
                }

                // Clinical Presentation
                HmsCard(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "Clinical Presentation",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = HmsNavy
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Symptoms: ${appointment.symptoms ?: "None reported."}",
                        fontSize = 13.sp,
                        color = HmsTextPrimary
                    )
                    if (!appointment.notes.isNullOrBlank()) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Triage Notes: ${appointment.notes}",
                            fontSize = 13.sp,
                            color = HmsTextSecondary
                        )
                    }
                    if (!appointment.consultationRoom.isNullOrBlank()) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Assigned Room: ${appointment.consultationRoom}",
                            fontSize = 13.sp,
                            color = HmsBlue,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }

                // Vitals Signs Telemetry (if available)
                val vitals = appointment.vitals
                if (vitals != null) {
                    HmsCard(
                        modifier = Modifier.fillMaxWidth(),
                        backgroundColor = HmsSurface
                    ) {
                        Text(
                            text = "Vital Signs Telemetry",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = HmsNavy
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            VitalItem(
                                label = "BP",
                                value = if (vitals.bpSystolic != null && vitals.bpDiastolic != null) "${vitals.bpSystolic}/${vitals.bpDiastolic}" else "--",
                                unit = "mmHg",
                                modifier = Modifier.weight(1f)
                            )
                            VitalItem(
                                label = "Pulse",
                                value = vitals.heartRateBpm?.toString() ?: "--",
                                unit = "bpm",
                                modifier = Modifier.weight(1f)
                            )
                            VitalItem(
                                label = "Temp",
                                value = vitals.temperatureCelsius?.toString() ?: "--",
                                unit = "°C",
                                modifier = Modifier.weight(1f)
                            )
                            VitalItem(
                                label = "SpO2",
                                value = vitals.spO2Percentage?.toString() ?: "--",
                                unit = "%",
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }

                // Clinical Actions Section
                Text(
                    text = "Clinical Actions",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = HmsNavy
                )

                // Workflow status transitions
                if (appointment.status.equals("Waiting", ignoreCase = true) || appointment.status.equals("Scheduled", ignoreCase = true)) {
                    Button(
                        onClick = {
                            viewModel.updateStatus(appointment.id, "In Consultation")
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = HmsBlue),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Call Patient / Start Consultation", fontWeight = FontWeight.SemiBold)
                    }
                }

                if (appointment.status.equals("In Consultation", ignoreCase = true)) {
                    Button(
                        onClick = {
                            viewModel.updateStatus(appointment.id, "Completed")
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = HmsSuccess),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Check, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Mark Consultation Completed", fontWeight = FontWeight.SemiBold)
                    }
                }

                // Digital Prescription shortcut
                HmsPrimaryButton(
                    text = "Create Digital Prescription",
                    onClick = {
                        onNavigate(
                            Screen.NewPrescription.createRoute(
                                appointmentId = appointment.id,
                                patientId = appointment.patientId,
                                patientName = appointment.patientName,
                                uhid = appointment.uhid,
                                age = appointment.patientAge,
                                gender = appointment.patientGender ?: "Male"
                            )
                        )
                    },
                    containerColor = HmsTeal
                )

                // Patient History shortcut
                HmsSecondaryButton(
                    text = "View Patient EHR & Timeline",
                    onClick = {
                        onNavigate(Screen.PatientHistory.createRoute(appointment.patientId))
                    }
                )

                // Inter-Hospital Patient Referral shortcut
                Button(
                    onClick = { showReferralDialog = true },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = HmsBlueDark),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Refer to City Network Hospital", fontWeight = FontWeight.SemiBold)
                }
            }

            if (showReferralDialog) {
                val vitalsStr = if (appointment.vitals != null) {
                    "BP: ${appointment.vitals.bpSystolic ?: 138}/${appointment.vitals.bpDiastolic ?: 88} mmHg • HR: ${appointment.vitals.heartRateBpm ?: 78} BPM • SpO2: ${appointment.vitals.spO2Percentage ?: 98}%"
                } else {
                    "BP: 138/88 mmHg • HR: 78 BPM • SpO2: 98%"
                }
                com.hms.doctor.core.ui.components.HmsReferralDialog(
                    patientName = appointment.patientName,
                    uhid = appointment.uhid,
                    patientAge = appointment.patientAge,
                    patientGender = appointment.patientGender ?: "Male",
                    diagnosis = appointment.symptoms ?: "Cardiovascular Consultation",
                    vitalsSummary = vitalsStr,
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
fun VitalItem(
    label: String,
    value: String,
    unit: String,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(8.dp),
        color = HmsBackground,
        border = androidx.compose.foundation.BorderStroke(1.dp, HmsBorder)
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = label,
                fontSize = 11.sp,
                color = HmsTextSecondary,
                fontWeight = FontWeight.Medium
            )
            Text(
                text = value,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = HmsNavy
            )
            Text(
                text = unit,
                fontSize = 9.sp,
                color = HmsTextSecondary
            )
        }
    }
}
