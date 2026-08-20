package com.hms.doctor.feature.patients

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
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
import com.hms.doctor.domain.model.Patient

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PatientSearchScreen(
    viewModel: PatientsViewModel,
    onNavigate: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Patient EHR Directory"
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
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.onSearchQueryChanged(it) },
                placeholder = { Text("Search by patient name, UHID, or phone...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = HmsBlue
                    )
                },
                trailingIcon = {
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onSearchQueryChanged("") }) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Clear",
                                tint = HmsTextSecondary
                            )
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                shape = RoundedCornerShape(10.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = HmsBlue,
                    unfocusedBorderColor = HmsBorder,
                    focusedContainerColor = HmsSurface,
                    unfocusedContainerColor = HmsSurface
                )
            )

            // Results List
            if (uiState.isLoading) {
                LoadingStateView(message = "Searching clinical patient records...")
            } else if (uiState.errorMessage != null && uiState.patients.isEmpty()) {
                ErrorStateView(
                    message = uiState.errorMessage!!,
                    onRetry = { viewModel.searchPatients(uiState.searchQuery) },
                    isNetworkError = uiState.isNetworkError
                )
            } else if (uiState.patients.isEmpty()) {
                EmptyStateView(
                    title = "No Patients Found",
                    description = "No registered patients matching '${uiState.searchQuery}'."
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(uiState.patients, key = { it.id }) { patient ->
                        PatientDirectoryCard(
                            patient = patient,
                            onClick = {
                                onNavigate(Screen.PatientHistory.createRoute(patient.id))
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun PatientDirectoryCard(
    patient: Patient,
    onClick: () -> Unit
) {
    HmsCard(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        elevation = 1.dp
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = CircleShape,
                color = HmsTealSubtle,
                modifier = Modifier.size(46.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Patient Avatar",
                        tint = HmsTealDark,
                        modifier = Modifier.size(26.dp)
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
                        text = patient.name,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = HmsNavy
                    )
                    StatusBadge(status = patient.status)
                }

                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "${patient.uhid} • ${patient.age} yrs, ${patient.gender} • ${patient.bloodGroup ?: "N/A"}",
                    fontSize = 12.sp,
                    color = HmsTextSecondary
                )

                if (!patient.condition.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Condition: ${patient.condition}",
                        fontSize = 12.sp,
                        color = HmsTextPrimary,
                        maxLines = 1
                    )
                }
            }
        }
    }
}
