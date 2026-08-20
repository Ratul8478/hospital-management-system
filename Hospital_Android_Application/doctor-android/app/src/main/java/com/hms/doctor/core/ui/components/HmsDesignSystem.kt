package com.hms.doctor.core.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.ui.theme.*

/**
 * 🎨 CALM CLINICAL INTELLIGENCE — DESIGN SYSTEM CORE COMPONENTS
 */

@Composable
fun HmsSectionHeader(
    title: String,
    modifier: Modifier = Modifier,
    actionText: String? = null,
    onActionClick: (() -> Unit)? = null
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = HmsNavy
        )
        if (actionText != null && onActionClick != null) {
            Text(
                text = actionText,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = HmsBlue,
                modifier = Modifier
                    .clickable(onClick = onActionClick)
                    .padding(4.dp)
            )
        }
    }
}

@Composable
fun HmsTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    leadingIcon: ImageVector? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    isError: Boolean = false,
    errorMessage: String? = null,
    singleLine: Boolean = true,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default
) {
    Column(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(label, fontSize = 13.sp) },
            placeholder = placeholder?.let { { Text(it, fontSize = 13.sp, color = HmsTextTertiary) } },
            leadingIcon = leadingIcon?.let {
                { Icon(imageVector = it, contentDescription = null, tint = HmsBlue, modifier = Modifier.size(20.dp)) }
            },
            trailingIcon = trailingIcon,
            isError = isError,
            singleLine = singleLine,
            visualTransformation = visualTransformation,
            keyboardOptions = keyboardOptions,
            keyboardActions = keyboardActions,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = HmsBlue,
                unfocusedBorderColor = HmsBorder,
                focusedContainerColor = HmsSurface,
                unfocusedContainerColor = HmsSurface,
                errorBorderColor = HmsDanger
            )
        )
        if (isError && errorMessage != null) {
            Text(
                text = errorMessage,
                color = HmsDanger,
                fontSize = 11.sp,
                modifier = Modifier.padding(start = 8.dp, top = 2.dp)
            )
        }
    }
}

@Composable
fun HmsSearchField(
    query: String,
    onQueryChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    onClear: () -> Unit = { onQueryChange("") }
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        color = HmsSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, HmsBorder),
        shadowElevation = 1.dp
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = HmsTextSecondary,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            TextField(
                value = query,
                onValueChange = onQueryChange,
                placeholder = { Text(placeholder, fontSize = 13.sp, color = HmsTextTertiary) },
                modifier = Modifier.weight(1f),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = HmsSurface,
                    unfocusedContainerColor = HmsSurface,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                singleLine = true
            )
            if (query.isNotEmpty()) {
                IconButton(onClick = onClear, modifier = Modifier.size(28.dp)) {
                    Icon(
                        imageVector = Icons.Default.Clear,
                        contentDescription = "Clear",
                        tint = HmsTextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun HmsPatientAvatar(
    name: String,
    size: Dp = 44.dp,
    backgroundColor: Color = HmsBlueLight,
    textColor: Color = HmsSurface
) {
    val initials = name.split(" ")
        .mapNotNull { it.firstOrNull()?.toString() }
        .take(2)
        .joinToString("")
        .uppercase()
        .ifEmpty { "PT" }

    Surface(
        modifier = Modifier.size(size),
        shape = CircleShape,
        color = backgroundColor
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                text = initials,
                color = textColor,
                fontSize = (size.value * 0.36f).sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun HmsConfirmationDialog(
    title: String,
    message: String,
    confirmText: String = "Confirm",
    dismissText: String = "Cancel",
    isDestructive: Boolean = false,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(text = title, fontWeight = FontWeight.Bold, color = HmsNavy) },
        text = { Text(text = message, fontSize = 14.sp, color = HmsTextPrimary) },
        confirmButton = {
            Button(
                onClick = onConfirm,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isDestructive) HmsDanger else HmsBlue
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(text = confirmText)
            }
        },
        dismissButton = {
            OutlinedButton(
                onClick = onDismiss,
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(text = dismissText, color = HmsTextSecondary)
            }
        }
    )
}
