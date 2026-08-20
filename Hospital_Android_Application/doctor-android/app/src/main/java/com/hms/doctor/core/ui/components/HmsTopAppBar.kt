package com.hms.doctor.core.ui.components

import androidx.compose.foundation.layout.RowScope
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.hms.doctor.core.ui.theme.HmsDanger
import com.hms.doctor.core.ui.theme.HmsNavy
import com.hms.doctor.core.ui.theme.HmsSurface

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HmsTopAppBar(
    title: String,
    modifier: Modifier = Modifier,
    showBackButton: Boolean = false,
    onBackClick: () -> Unit = {},
    notificationCount: Int = 0,
    onNotificationClick: () -> Unit = {},
    actions: @Composable RowScope.() -> Unit = {}
) {
    TopAppBar(
        title = {
            Text(
                text = title,
                fontWeight = FontWeight.SemiBold,
                color = HmsSurface
            )
        },
        modifier = modifier,
        navigationIcon = {
            if (showBackButton) {
                IconButton(onClick = onBackClick) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = HmsSurface
                    )
                }
            }
        },
        actions = {
            actions()
            if (notificationCount >= 0) {
                IconButton(onClick = onNotificationClick) {
                    BadgedBox(
                        badge = {
                            if (notificationCount > 0) {
                                Badge(containerColor = HmsDanger) {
                                    Text(text = notificationCount.toString(), color = HmsSurface)
                                }
                            }
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Notifications,
                            contentDescription = "Notifications",
                            tint = HmsSurface
                        )
                    }
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = HmsNavy,
            titleContentColor = HmsSurface,
            actionIconContentColor = HmsSurface
        )
    )
}
