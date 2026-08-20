package com.hms.doctor.feature.prescriptions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Medication
import androidx.compose.material.icons.filled.Refresh
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
import com.hms.doctor.domain.model.Prescription

@Composable
fun PrescriptionsListScreen(
    viewModel: PrescriptionViewModel,
    onNavigate: (String) -> Unit
) {
    LaunchedEffect(Unit) {
        viewModel.fetchPrescriptionsList()
    }

    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Digital Prescriptions",
                actions = {
                    IconButton(onClick = { viewModel.fetchPrescriptionsList() }) {
                        Icon(imageVector = Icons.Default.Refresh, contentDescription = "Refresh", tint = HmsSurface)
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { onNavigate(Screen.NewPrescription.createRoute()) },
                containerColor = HmsBlue,
                contentColor = HmsSurface
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "New Rx")
            }
        }
    ) { paddingValues ->
        if (uiState.isFetching) {
            LoadingStateView(
                message = "Retrieving electronic prescriptions...",
                modifier = Modifier.padding(paddingValues)
            )
        } else if (uiState.prescriptionsList.isEmpty()) {
            EmptyStateView(
                title = "No Prescriptions Found",
                description = "No digital prescriptions issued yet today.",
                modifier = Modifier.padding(paddingValues)
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .background(HmsBackground)
                    .padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(uiState.prescriptionsList, key = { it.id }) { rx ->
                    PrescriptionCard(prescription = rx)
                }
            }
        }
    }
}

@Composable
fun PrescriptionCard(prescription: Prescription) {
    HmsCard(modifier = Modifier.fillMaxWidth(), elevation = 1.dp) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = prescription.prescriptionNumber ?: "RX-#${prescription.id}",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsNavy
                )
                Text(
                    text = "${prescription.patientName} (${prescription.uhid})",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = HmsTextPrimary
                )
            }
            StatusBadge(status = prescription.status)
        }

        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = "Diagnosis: ${prescription.diagnosis}",
            fontSize = 13.sp,
            color = HmsTextPrimary
        )

        if (prescription.medicines.isNotEmpty()) {
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "Drugs: ${prescription.medicines.joinToString(", ") { it.name }}",
                fontSize = 12.sp,
                color = HmsTextSecondary
            )
        }
    }
}
