package com.hms.doctor.core.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.ui.theme.*

@Composable
fun StatusBadge(
    status: String,
    modifier: Modifier = Modifier
) {
    val normStatus = status.uppercase().replace(" ", "_")

    val (bg, textColor, borderColor, dotColor) = when (normStatus) {
        "WAITING", "PENDING", "PROCESSING" -> Quadruple(HmsWarningSubtle, HmsWarningDark, HmsWarning.copy(alpha = 0.3f), HmsWarning)
        "IN_CONSULTATION", "IN CONSULTATION", "ACTIVE", "OPD" -> Quadruple(HmsBlueSubtle, HmsBlue, HmsBlue.copy(alpha = 0.3f), HmsBlue)
        "COMPLETED", "READY", "AVAILABLE", "NORMAL" -> Quadruple(HmsSuccessSubtle, HmsSuccessDark, HmsSuccess.copy(alpha = 0.3f), HmsSuccess)
        "SCHEDULED", "CONFIRMED" -> Quadruple(HmsTealSubtle, HmsTealDark, HmsTeal.copy(alpha = 0.3f), HmsTeal)
        "CRITICAL", "ABNORMAL", "CANCELLED", "NO_SHOW", "BUSY", "OFF_DUTY" -> Quadruple(HmsDangerSubtle, HmsDangerDark, HmsDanger.copy(alpha = 0.4f), HmsDanger)
        else -> Quadruple(HmsBlueSubtle, HmsBlue, HmsBlue.copy(alpha = 0.3f), HmsBlue)
    }

    Box(
        modifier = modifier
            .background(bg, RoundedCornerShape(20.dp))
            .border(1.dp, borderColor, RoundedCornerShape(20.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .background(dotColor, CircleShape)
            )
            Text(
                text = status.replace("_", " "),
                color = textColor,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.2.sp
            )
        }
    }
}

private data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)
