package com.hms.doctor.feature.reports

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
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
import com.hms.doctor.domain.model.DiagnosticReport

@Composable
fun ReportsScreen(
    viewModel: ReportsViewModel,
    onNavigate: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Diagnostic & Lab Reports",
                actions = {
                    IconButton(onClick = { viewModel.loadReports() }) {
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
            // Category / Status Filter Chips
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        selected = uiState.selectedFilter == "ALL",
                        onClick = { viewModel.setFilter("ALL") },
                        label = { Text("All (${uiState.summary?.total ?: uiState.reports.size})") }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.selectedFilter == "READY",
                        onClick = { viewModel.setFilter("READY") },
                        label = { Text("Ready (${uiState.summary?.ready ?: 0})") }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.selectedFilter == "PENDING",
                        onClick = { viewModel.setFilter("PENDING") },
                        label = { Text("Pending (${uiState.summary?.pending ?: 0})") }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.selectedFilter == "CRITICAL",
                        onClick = { viewModel.setFilter("CRITICAL") },
                        label = { Text("Critical Alerts (${uiState.summary?.criticalAlerts ?: 0})") }
                    )
                }
            }

            if (uiState.isLoading) {
                LoadingStateView(message = "Loading diagnostic reports...")
            } else if (uiState.errorMessage != null && uiState.reports.isEmpty()) {
                ErrorStateView(
                    message = uiState.errorMessage!!,
                    onRetry = { viewModel.loadReports() },
                    isNetworkError = uiState.isNetworkError
                )
            } else if (uiState.filteredReports.isEmpty()) {
                EmptyStateView(
                    title = "No Reports",
                    description = "No diagnostic reports found under the selected category."
                )
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(uiState.filteredReports, key = { it.id }) { report ->
                        DiagnosticReportCard(report = report)
                    }
                }
            }
        }
    }
}

@Composable
fun DiagnosticReportCard(report: DiagnosticReport) {
    HmsCard(
        modifier = Modifier.fillMaxWidth(),
        borderColor = if (report.criticalAlert) HmsDanger.copy(alpha = 0.5f) else HmsBorder,
        elevation = 1.dp
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = report.testName,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsNavy
                )
                Text(
                    text = "${report.patientName} (${report.uhid})",
                    fontSize = 13.sp,
                    color = HmsTextSecondary
                )
            }
            StatusBadge(status = if (report.criticalAlert) "CRITICAL" else report.status)
        }

        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Category: ${report.category} • Collected: ${report.sampleCollectedAt?.split("T")?.firstOrNull() ?: "Recent"}",
            fontSize = 12.sp,
            color = HmsTextSecondary
        )

        if (!report.resultSummary.isNullOrBlank()) {
            Spacer(modifier = Modifier.height(6.dp))
            Surface(
                shape = RoundedCornerShape(6.dp),
                color = if (report.criticalAlert) HmsDangerSubtle else HmsSurfaceVariant,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Findings: ${report.resultSummary}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = if (report.criticalAlert) HmsDanger else HmsTextPrimary,
                    modifier = Modifier.padding(8.dp)
                )
            }
        }
    }
}
