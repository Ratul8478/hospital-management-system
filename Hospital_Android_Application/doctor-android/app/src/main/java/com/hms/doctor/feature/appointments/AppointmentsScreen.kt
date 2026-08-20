package com.hms.doctor.feature.appointments

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.navigation.Screen
import com.hms.doctor.core.ui.components.*
import com.hms.doctor.core.ui.theme.*
import com.hms.doctor.domain.model.Appointment

@Composable
fun AppointmentsScreen(
    viewModel: AppointmentsViewModel,
    onNavigate: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Today's OPD Queue",
                showBackButton = true,
                onBackClick = { onNavigate(Screen.Home.route) }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(HmsBackground)
                .padding(paddingValues)
        ) {
            // Search Bar
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                shape = RoundedCornerShape(14.dp),
                color = HmsSurface,
                border = androidx.compose.foundation.BorderStroke(1.dp, HmsBorder),
                shadowElevation = 1.dp
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = HmsTextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    TextField(
                        value = uiState.searchQuery,
                        onValueChange = { viewModel.setSearchQuery(it) },
                        placeholder = { Text("Search by patient name, UHID, or token...", fontSize = 13.sp, color = HmsTextTertiary) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = HmsSurface,
                            unfocusedContainerColor = HmsSurface,
                            focusedIndicatorColor = androidx.compose.ui.graphics.Color.Transparent,
                            unfocusedIndicatorColor = androidx.compose.ui.graphics.Color.Transparent
                        ),
                        singleLine = true
                    )
                }
            }

            // Filter Pills Bar
            val filterOptions = listOf(
                "ALL" to "All (${uiState.appointments.size})",
                "WAITING" to "Waiting (${uiState.queueStats?.waiting ?: 0})",
                "IN_CONSULTATION" to "In Consult (${uiState.queueStats?.inConsultation ?: 0})",
                "COMPLETED" to "Completed (${uiState.queueStats?.completed ?: 0})"
            )

            LazyRow(
                modifier = Modifier.fillMaxWidth(),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(filterOptions) { (key, label) ->
                    val isSelected = uiState.selectedFilter.equals(key, ignoreCase = true)
                    Surface(
                        onClick = { viewModel.setFilter(key) },
                        shape = RoundedCornerShape(20.dp),
                        color = if (isSelected) HmsBlue else HmsSurface,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isSelected) HmsBlue else HmsBorder
                        ),
                        shadowElevation = if (isSelected) 2.dp else 0.dp
                    ) {
                        Text(
                            text = label,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) HmsSurface else HmsTextSecondary,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp)
                        )
                    }
                }
            }

            // Appointment List
            if (uiState.isLoading && uiState.appointments.isEmpty()) {
                LoadingStateView()
            } else if (uiState.filteredAppointments.isEmpty()) {
                EmptyStateView(
                    title = "No Appointments Found",
                    description = "No matching patients in today's OPD queue."
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(uiState.filteredAppointments, key = { it.id }) { appointment ->
                        AppointmentItemCard(
                            appointment = appointment,
                            onClick = { onNavigate(Screen.AppointmentDetail.createRoute(appointment.id)) },
                            onWriteRx = {
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
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AppointmentItemCard(
    appointment: Appointment,
    onClick: () -> Unit,
    onWriteRx: () -> Unit
) {
    HmsCard(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        elevation = 1.5.dp,
        innerPadding = 14.dp
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = HmsNavy
            ) {
                Text(
                    text = "TOKEN #${appointment.tokenNumber}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsSurface,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
            StatusBadge(status = appointment.status)
        }

        Spacer(modifier = Modifier.height(10.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = appointment.patientName,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsTextPrimary
                )
                Text(
                    text = "${appointment.uhid} • ${appointment.patientAge} yrs, ${appointment.patientGender ?: "Unspecified"}",
                    fontSize = 12.sp,
                    color = HmsTextSecondary
                )
                Text(
                    text = "Scheduled: ${appointment.appointmentTime ?: "10:00 AM"} • ${appointment.type}",
                    fontSize = 11.sp,
                    color = HmsBlue,
                    fontWeight = FontWeight.SemiBold
                )
            }
            IconButton(
                onClick = onWriteRx,
                modifier = Modifier
                    .background(HmsSuccessSubtle, CircleShape)
                    .size(36.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.EditNote,
                    contentDescription = "New Rx",
                    tint = HmsSuccessDark,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
