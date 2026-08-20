package com.hms.doctor.feature.notifications

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

data class NotificationItem(
    val id: String,
    val title: String,
    val message: String,
    val timestamp: String,
    val type: String, // APPOINTMENT, REPORT, EMERGENCY, ADMISSION
    val targetId: String? = null
)

data class NotificationsUiState(
    val notifications: List<NotificationItem> = listOf(
        NotificationItem(
            id = "notif-1",
            title = "Critical Lab Report Ready",
            message = "Lipid Profile & HbA1c results uploaded for patient Aarav Sharma (UHID-2026-0042).",
            timestamp = "10 mins ago",
            type = "REPORT",
            targetId = "401"
        ),
        NotificationItem(
            id = "notif-2",
            title = "Emergency OPD Consultation Added",
            message = "New urgent cardiology consult scheduled for Token #14.",
            timestamp = "25 mins ago",
            type = "APPOINTMENT",
            targetId = "101"
        ),
        NotificationItem(
            id = "notif-3",
            title = "Inpatient Ward Transfer",
            message = "Patient admitted to ICU Bed #04 under Dr. Sarah Williams.",
            timestamp = "1 hour ago",
            type = "ADMISSION",
            targetId = "301"
        )
    )
)

@HiltViewModel
class NotificationsViewModel @Inject constructor() : ViewModel() {
    private val _uiState = MutableStateFlow(NotificationsUiState())
    val uiState: StateFlow<NotificationsUiState> = _uiState.asStateFlow()
}
