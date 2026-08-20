package com.hms.doctor.feature.prescriptions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Medication
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.ui.components.*
import com.hms.doctor.core.ui.theme.*

@Composable
fun NewPrescriptionScreen(
    appointmentId: Int?,
    patientId: Int,
    patientName: String,
    uhid: String,
    age: Int,
    gender: String,
    viewModel: PrescriptionViewModel,
    onSuccessBack: () -> Unit,
    onBackClick: () -> Unit
) {
    LaunchedEffect(patientId) {
        viewModel.initPatientContext(
            appointmentId = appointmentId,
            patientId = patientId,
            patientName = patientName,
            uhid = uhid,
            age = age,
            gender = gender
        )
    }

    val uiState by viewModel.uiState.collectAsState()
    var showSuccessDialog by remember { mutableStateOf(false) }

    if (showSuccessDialog) {
        AlertDialog(
            onDismissRequest = {
                showSuccessDialog = false
                onSuccessBack()
            },
            icon = {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Success",
                    tint = HmsSuccess,
                    modifier = Modifier.size(48.dp)
                )
            },
            title = {
                Text("Prescription Generated & Routed", fontWeight = FontWeight.Bold)
            },
            text = {
                Text(
                    "Prescription #${uiState.submittedPrescription?.prescriptionNumber ?: "RX-2026-NEW"} has been safely saved to MySQL and dispatched to the Central Pharmacy."
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showSuccessDialog = false
                        onSuccessBack()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = HmsSuccess)
                ) {
                    Text("Done")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "New Digital Rx",
                showBackButton = true,
                onBackClick = onBackClick
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(HmsBackground)
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Patient Header Card
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
                                text = "Prescription For",
                                fontSize = 11.sp,
                                color = HmsTealLight
                            )
                            Text(
                                text = uiState.patientName.ifBlank { "Patient Consultation" },
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = HmsSurface
                            )
                            Text(
                                text = "${uiState.uhid} • ${uiState.patientAge} yrs, ${uiState.patientGender}",
                                fontSize = 12.sp,
                                color = HmsSurface.copy(alpha = 0.9f)
                            )
                        }
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = HmsBlueLight
                        ) {
                            Text(
                                text = "Rx Authoring",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HmsSurface,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }

            // Error banner if any
            if (uiState.errorMessage != null) {
                item {
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        color = HmsDangerSubtle,
                        border = androidx.compose.foundation.BorderStroke(1.dp, HmsDanger.copy(alpha = 0.3f))
                    ) {
                        Text(
                            text = uiState.errorMessage!!,
                            color = HmsDanger,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            }

            // Clinical Diagnosis & Symptoms
            item {
                HmsCard(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "Clinical Diagnosis & Findings",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = HmsNavy
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = uiState.diagnosis,
                        onValueChange = { viewModel.onDiagnosisChanged(it) },
                        label = { Text("Diagnosis (e.g. Hypertension, Acute Bronchitis) *") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = HmsBlue,
                            unfocusedBorderColor = HmsBorder
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = uiState.symptoms,
                        onValueChange = { viewModel.onSymptomsChanged(it) },
                        label = { Text("Presenting Symptoms & Clinical Notes") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = HmsBlue,
                            unfocusedBorderColor = HmsBorder
                        )
                    )
                }
            }

            // Medicines Header & Builder
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Prescribed Medications (${uiState.medicines.size})",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = HmsNavy
                    )
                    TextButton(onClick = { viewModel.addMedicine() }) {
                        Icon(imageVector = Icons.Default.Add, contentDescription = "Add Drug", tint = HmsBlue)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Add Drug", color = HmsBlue, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            // Dynamic Medicine Rows
            itemsIndexed(uiState.medicines) { index, med ->
                MedicineRowCard(
                    index = index,
                    item = med,
                    canDelete = uiState.medicines.size > 1,
                    onUpdate = { updated -> viewModel.updateMedicine(index, updated) },
                    onDelete = { viewModel.removeMedicine(index) }
                )
            }

            // Advice & Follow-up
            item {
                HmsCard(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "Doctor Advice & Instructions",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = HmsNavy
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = uiState.advice,
                        onValueChange = { viewModel.onAdviceChanged(it) },
                        label = { Text("Clinical Advice / Diet / Lifestyle") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = HmsBlue,
                            unfocusedBorderColor = HmsBorder
                        )
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = uiState.followUpDate,
                        onValueChange = { viewModel.onFollowUpDateChanged(it) },
                        label = { Text("Next Follow-up Date (e.g. 2026-08-25)") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = HmsBlue,
                            unfocusedBorderColor = HmsBorder
                        )
                    )
                }
            }

            // Submit Prescription Button
            item {
                HmsPrimaryButton(
                    text = "Sign & Dispatch Prescription to Pharmacy",
                    onClick = {
                        viewModel.submitPrescription {
                            showSuccessDialog = true
                        }
                    },
                    isLoading = uiState.isSubmitting,
                    containerColor = HmsSuccess
                )
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
fun MedicineRowCard(
    index: Int,
    item: MedicineFormItem,
    canDelete: Boolean,
    onUpdate: (MedicineFormItem) -> Unit,
    onDelete: () -> Unit
) {
    HmsCard(
        modifier = Modifier.fillMaxWidth(),
        elevation = 1.dp
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Medication,
                    contentDescription = null,
                    tint = HmsBlue,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Medication #${index + 1}",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsNavy
                )
            }
            if (canDelete) {
                IconButton(onClick = onDelete) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Remove",
                        tint = HmsDanger
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = item.name,
            onValueChange = { onUpdate(item.copy(name = it)) },
            label = { Text("Medicine Name (e.g. Telmisartan 40mg) *") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = HmsBlue,
                unfocusedBorderColor = HmsBorder
            )
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = item.dosage,
                onValueChange = { onUpdate(item.copy(dosage = it)) },
                label = { Text("Dosage") },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp)
            )
            OutlinedTextField(
                value = item.duration,
                onValueChange = { onUpdate(item.copy(duration = it)) },
                label = { Text("Duration") },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = item.frequency,
            onValueChange = { onUpdate(item.copy(frequency = it)) },
            label = { Text("Frequency & Schedule") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        )
    }
}
