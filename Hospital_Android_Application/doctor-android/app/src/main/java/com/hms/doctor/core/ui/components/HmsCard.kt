package com.hms.doctor.core.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.hms.doctor.core.ui.theme.HmsBorder
import com.hms.doctor.core.ui.theme.HmsSurface

@Composable
fun HmsCard(
    modifier: Modifier = Modifier,
    backgroundColor: Color = HmsSurface,
    borderColor: Color = HmsBorder,
    cornerRadius: Dp = 16.dp,
    elevation: Dp = 1.5.dp,
    innerPadding: Dp = 16.dp,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    if (onClick != null) {
        Card(
            onClick = onClick,
            modifier = modifier,
            shape = RoundedCornerShape(cornerRadius),
            colors = CardDefaults.cardColors(containerColor = backgroundColor),
            border = BorderStroke(1.dp, borderColor),
            elevation = CardDefaults.cardElevation(
                defaultElevation = elevation,
                pressedElevation = elevation + 2.dp,
                hoveredElevation = elevation + 1.dp
            )
        ) {
            Column(
                modifier = Modifier.padding(innerPadding),
                content = content
            )
        }
    } else {
        Card(
            modifier = modifier,
            shape = RoundedCornerShape(cornerRadius),
            colors = CardDefaults.cardColors(containerColor = backgroundColor),
            border = BorderStroke(1.dp, borderColor),
            elevation = CardDefaults.cardElevation(defaultElevation = elevation)
        ) {
            Column(
                modifier = Modifier.padding(innerPadding),
                content = content
            )
        }
    }
}
