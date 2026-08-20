package com.hms.doctor.feature.earnings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AttachMoney
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

@Composable
fun EarningsScreen(
    viewModel: EarningsViewModel,
    onBackClick: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Earnings & Analytics",
                showBackButton = true,
                onBackClick = onBackClick,
                actions = {
                    IconButton(onClick = { viewModel.loadEarnings() }) {
                        Icon(imageVector = Icons.Default.Refresh, contentDescription = "Refresh", tint = HmsSurface)
                    }
                }
            )
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
            LoadingStateView(message = "Loading consultation fee analytics...", modifier = Modifier.padding(paddingValues))
        } else {
            val earn = uiState.earnings
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(HmsBackground)
                    .padding(paddingValues)
                    .verticalScroll(scrollState)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Period Selector
                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        FilterChip(
                            selected = uiState.selectedPeriod == "TODAY",
                            onClick = { viewModel.setPeriod("TODAY") },
                            label = { Text("Today") }
                        )
                    }
                    item {
                        FilterChip(
                            selected = uiState.selectedPeriod == "THIS_MONTH",
                            onClick = { viewModel.setPeriod("THIS_MONTH") },
                            label = { Text("This Month") }
                        )
                    }
                    item {
                        FilterChip(
                            selected = uiState.selectedPeriod == "TOTAL",
                            onClick = { viewModel.setPeriod("TOTAL") },
                            label = { Text("All Time") }
                        )
                    }
                }

                // Main Metric Card
                HmsCard(
                    modifier = Modifier.fillMaxWidth(),
                    backgroundColor = HmsNavy,
                    elevation = 2.dp
                ) {
                    val (amount, consults, label) = when (uiState.selectedPeriod) {
                        "TODAY" -> Triple(earn?.todayEarnings ?: 0.0, earn?.todayConsultations ?: 0, "Today's Revenue")
                        "THIS_MONTH" -> Triple(earn?.monthEarnings ?: 0.0, earn?.monthConsultations ?: 0, "Monthly Revenue")
                        else -> Triple(earn?.totalEarnings ?: 0.0, earn?.totalConsultations ?: 0, "Total Lifetime Revenue")
                    }

                    Text(
                        text = label,
                        fontSize = 13.sp,
                        color = HmsTealLight,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${earn?.currency ?: "₹"}${String.format("%.2f", amount)}",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = HmsSurface
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "$consults Consultations Completed",
                        fontSize = 13.sp,
                        color = HmsSurface.copy(alpha = 0.9f)
                    )
                }

                // Consultation Rates & Payout Breakdown
                Text(
                    text = "Consultation Rate & Payouts",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = HmsNavy
                )

                HmsCard(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = "Standard OPD Consultation Fee", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = HmsTextPrimary)
                            Text(text = "Per patient OPD visit", fontSize = 12.sp, color = HmsTextSecondary)
                        }
                        Text(
                            text = "${earn?.currency ?: "₹"}${earn?.fee ?: 0.0}",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = HmsBlue
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    HorizontalDivider(color = HmsBorder)
                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = "Pending Hospital Payout", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = HmsTextPrimary)
                            Text(text = "Scheduled for weekly cycle", fontSize = 12.sp, color = HmsTextSecondary)
                        }
                        Text(
                            text = "${earn?.currency ?: "₹"}${earn?.pendingPayout ?: 0.0}",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = HmsSuccess
                        )
                    }
                }
            }
        }
    }
}
