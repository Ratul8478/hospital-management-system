package com.hms.doctor.feature.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Person
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

@Composable
fun ProfileScreen(
    viewModel: ProfileViewModel,
    onLogoutSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Doctor Profile"
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(HmsBackground)
                .padding(paddingValues)
                .verticalScroll(scrollState)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Profile Card
            HmsCard(
                modifier = Modifier.fillMaxWidth(),
                backgroundColor = HmsNavy,
                elevation = 2.dp
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        modifier = Modifier.size(60.dp),
                        shape = CircleShape,
                        color = HmsBlueLight
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = "Avatar",
                                tint = HmsSurface,
                                modifier = Modifier.size(36.dp)
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
                            text = uiState.email,
                            fontSize = 12.sp,
                            color = HmsTealLight
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${uiState.specialty} • ${uiState.department}",
                            fontSize = 13.sp,
                            color = HmsSurface.copy(alpha = 0.9f)
                        )
                    }
                }
            }

            // Duty Status Switcher
            Text(
                text = "Clinical Availability / Duty Status",
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = HmsNavy
            )

            HmsCard(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = uiState.dutyStatus == "AVAILABLE",
                        onClick = { viewModel.updateDutyStatus("AVAILABLE") },
                        label = { Text("Available (OPD)") },
                        modifier = Modifier.weight(1f)
                    )
                    FilterChip(
                        selected = uiState.dutyStatus == "BUSY",
                        onClick = { viewModel.updateDutyStatus("BUSY") },
                        label = { Text("In Surgery") },
                        modifier = Modifier.weight(1f)
                    )
                    FilterChip(
                        selected = uiState.dutyStatus == "OFF_DUTY",
                        onClick = { viewModel.updateDutyStatus("OFF_DUTY") },
                        label = { Text("Off Duty") },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Credentials & Hospital Affiliation
            Text(
                text = "Credentials & Department Details",
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = HmsNavy
            )

            HmsCard(modifier = Modifier.fillMaxWidth()) {
                ProfileDetailRow("Medical License ID", "NMC-2024-88412")
                Spacer(modifier = Modifier.height(10.dp))
                HorizontalDivider(color = HmsDivider)
                Spacer(modifier = Modifier.height(10.dp))

                ProfileDetailRow("Qualification", "MBBS, MD (Cardiology), FACC")
                Spacer(modifier = Modifier.height(10.dp))
                HorizontalDivider(color = HmsDivider)
                Spacer(modifier = Modifier.height(10.dp))

                ProfileDetailRow("Hospital Campus", "Medix Central Multi-Specialty Hospital")
                Spacer(modifier = Modifier.height(10.dp))
                HorizontalDivider(color = HmsDivider)
                Spacer(modifier = Modifier.height(10.dp))

                ProfileDetailRow("Consultation Room", "OPD Suite 302, Wing A")
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Logout Button
            Button(
                onClick = { viewModel.logout(onLogoutSuccess) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = HmsDangerSubtle, contentColor = HmsDanger)
            ) {
                Icon(imageVector = Icons.Default.ExitToApp, contentDescription = "Logout")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sign Out of HMS Doctor", fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Composable
fun ProfileDetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, fontSize = 13.sp, color = HmsTextSecondary)
        Text(text = value, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = HmsNavy)
    }
}
