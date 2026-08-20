package com.hms.doctor.feature.followups

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
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
import com.hms.doctor.domain.model.FollowUp

@Composable
fun FollowUpsScreen(
    viewModel: FollowUpsViewModel,
    onBackClick: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Follow-up Schedule",
                showBackButton = true,
                onBackClick = onBackClick,
                actions = {
                    IconButton(onClick = { viewModel.loadFollowUps() }) {
                        Icon(imageVector = Icons.Default.Refresh, contentDescription = "Refresh", tint = HmsSurface)
                    }
                }
            )
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
            LoadingStateView(message = "Loading upcoming follow-ups...", modifier = Modifier.padding(paddingValues))
        } else if (uiState.followups.isEmpty()) {
            EmptyStateView(
                title = "No Follow-ups",
                description = "No follow-up appointments scheduled on current roster.",
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
                items(uiState.followups, key = { it.id }) { followup ->
                    FollowUpItemCard(followup = followup)
                }
            }
        }
    }
}

@Composable
fun FollowUpItemCard(followup: FollowUp) {
    HmsCard(modifier = Modifier.fillMaxWidth(), elevation = 1.dp) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = followup.patientName,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsNavy
                )
                Text(
                    text = "UHID: ${followup.uhid}",
                    fontSize = 12.sp,
                    color = HmsTextSecondary
                )
            }
            StatusBadge(status = followup.status)
        }

        Spacer(modifier = Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Default.CalendarMonth,
                contentDescription = null,
                tint = HmsBlue,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Scheduled Date: ${followup.scheduledDate}",
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = HmsTextPrimary
            )
        }

        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Clinical Reason: ${followup.reason}",
            fontSize = 12.sp,
            color = HmsTextSecondary
        )
    }
}
