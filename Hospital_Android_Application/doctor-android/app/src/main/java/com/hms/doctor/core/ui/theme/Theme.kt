package com.hms.doctor.core.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = HmsBlue,
    onPrimary = HmsSurface,
    primaryContainer = HmsBlueSubtle,
    onPrimaryContainer = HmsNavy,
    secondary = HmsTeal,
    onSecondary = HmsSurface,
    secondaryContainer = HmsTealSubtle,
    onSecondaryContainer = HmsTealDark,
    tertiary = HmsNavy,
    onTertiary = HmsSurface,
    background = HmsBackground,
    onBackground = HmsTextPrimary,
    surface = HmsSurface,
    onSurface = HmsTextPrimary,
    surfaceVariant = HmsSurfaceVariant,
    onSurfaceVariant = HmsTextSecondary,
    outline = HmsBorder,
    error = HmsDanger,
    onError = HmsSurface,
    errorContainer = HmsDangerSubtle,
    onErrorContainer = HmsDanger
)

@Composable
fun HmsDoctorTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = LightColorScheme // Professional Clinical Light Theme by default

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = HmsNavy.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = HmsTypography,
        shapes = HmsShapes,
        content = content
    )
}
