package com.hms.doctor.feature.admissions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Hotel
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.ui.components.*
import com.hms.doctor.core.ui.theme.*
import com.hms.doctor.domain.model.Admission

@Composable
fun AdmissionsScreen(
    viewModel: AdmissionsViewModel,
    onBackClick: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "IPD Inpatients & Beds",
                showBackButton = true,
                onBackClick = onBackClick,
                actions = {
                    IconButton(onClick = { viewModel.loadAdmissions() }) {
                        Icon(imageVector = Icons.Default.Refresh, contentDescription = "Refresh", tint = HmsSurface)
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(HmsBackground)
                .padding(paddingValues)
        ) {
            // Ward Selector
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        selected = uiState.selectedWard == "ALL",
                        onClick = { viewModel.setWardFilter("ALL") },
                        label = { Text("All Wards (${uiState.admissions.size})") }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.selectedWard == "ICU",
                        onClick = { viewModel.setWardFilter("ICU") },
                        label = { Text("ICU") }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.selectedWard == "PRIVATE",
                        onClick = { viewModel.setWardFilter("PRIVATE") },
                        label = { Text("Private") }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.selectedWard == "GENERAL",
                        onClick = { viewModel.setWardFilter("GENERAL") },
                        label = { Text("General") }
                    )
                }
            }

            if (uiState.isLoading) {
                LoadingStateView(message = "Loading IPD bed allocations...")
            } else if (uiState.filteredAdmissions.isEmpty()) {
                EmptyStateView(
                    title = "No Inpatients Found",
                    description = "No active inpatients in the selected ward."
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(uiState.filteredAdmissions, key = { it.id }) { admission ->
                        InpatientBedCard(admission = admission)
                    }
                }
            }
        }
    }
}

@Composable
fun InpatientBedCard(admission: Admission) {
    HmsCard(
        modifier = Modifier.fillMaxWidth(),
        elevation = 1.dp
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = admission.patientName,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsNavy
                )
                Text(
                    text = "${admission.uhid} • ${admission.patientAge} yrs, ${admission.patientGender ?: "Unspecified"}",
                    fontSize = 12.sp,
                    color = HmsTextSecondary
                )
            }
            Surface(
                shape = RoundedCornerShape(6.dp),
                color = when (admission.wardType.lowercase()) {
                    "icu" -> HmsDangerSubtle
                    "private" -> HmsBlueSubtle
                    else -> HmsTealSubtle
                }
            ) {
                Text(
                    text = "${admission.wardType.uppercase()} • Room ${admission.roomNumber} / Bed ${admission.bedNumber}",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = when (admission.wardType.lowercase()) {
                        "icu" -> HmsDanger
                        "private" -> HmsBlue
                        else -> HmsTealDark
                    },
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Diagnosis: ${admission.diagnosis}",
            fontSize = 13.sp,
            color = HmsTextPrimary
        )

        if (!admission.nursingNotes.isNullOrBlank()) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Nursing: ${admission.nursingNotes}",
                fontSize = 12.sp,
                color = HmsTextSecondary
            )
        }

        if (!admission.attendingNurse.isNullOrBlank()) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Attending Nurse: ${admission.attendingNurse}",
                fontSize = 11.sp,
                color = HmsTextSecondary
            )
        }
    }
}
