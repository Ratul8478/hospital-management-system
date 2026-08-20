package com.hms.doctor.feature.notifications

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Hotel
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.ui.components.*
import com.hms.doctor.core.ui.theme.*

@Composable
fun NotificationsScreen(
    viewModel: NotificationsViewModel,
    onBackClick: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            HmsTopAppBar(
                title = "Clinical Notifications",
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
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(uiState.notifications, key = { it.id }) { notif ->
                NotificationCard(item = notif)
            }
        }
    }
}

@Composable
fun NotificationCard(item: NotificationItem) {
    val (icon, color) = when (item.type) {
        "REPORT" -> Pair(Icons.Default.Description, HmsWarning)
        "APPOINTMENT" -> Pair(Icons.Default.CalendarMonth, HmsBlue)
        "ADMISSION" -> Pair(Icons.Default.Hotel, HmsNavy)
        else -> Pair(Icons.Default.Notifications, HmsTeal)
    }

    HmsCard(modifier = Modifier.fillMaxWidth(), elevation = 1.dp) {
        Row(modifier = Modifier.fillMaxWidth()) {
            Surface(
                shape = CircleShape,
                color = color.copy(alpha = 0.12f),
                modifier = Modifier.size(40.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(imageVector = icon, contentDescription = null, tint = color, modifier = Modifier.size(22.dp))
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = item.title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = HmsNavy)
                    Text(text = item.timestamp, fontSize = 11.sp, color = HmsTextSecondary)
                }

                Spacer(modifier = Modifier.height(4.dp))
                Text(text = item.message, fontSize = 13.sp, color = HmsTextPrimary)
            }
        }
    }
}
