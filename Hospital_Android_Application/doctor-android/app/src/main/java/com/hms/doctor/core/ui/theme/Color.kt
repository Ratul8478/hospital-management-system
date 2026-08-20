package com.hms.doctor.core.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// ==========================================================================
// CALM CLINICAL INTELLIGENCE — PRODUCTION HEALTHCARE PALETTE
// ==========================================================================

// Core Identity Colors
val HmsNavy = Color(0xFF123B5D)
val HmsNavyDark = Color(0xFF0C273E)
val HmsNavyLight = Color(0xFF1E527F)
val HmsNavySurface = Color(0xFF1A456C)

// Clinical Primary Blue
val HmsBlue = Color(0xFF1E6FD9)
val HmsBlueDark = Color(0xFF1557AD)
val HmsBlueLight = Color(0xFF4B8FE3)
val HmsBlueSubtle = Color(0xFFEEF5FD)
val HmsBlueGlow = Color(0x331E6FD9)

// Bio-Teal
val HmsTeal = Color(0xFF16A6B6)
val HmsTealDark = Color(0xFF107E8B)
val HmsTealLight = Color(0xFF38C1D0)
val HmsTealSubtle = Color(0xFFE8F7F9)

// Clinical Emerald Green (Normal / Success / Done)
val HmsSuccess = Color(0xFF159A67)
val HmsSuccessDark = Color(0xFF0F724C)
val HmsSuccessLight = Color(0xFF34B784)
val HmsSuccessSubtle = Color(0xFFE8F6F0)

// Clinical Amber (Waiting / Review / Attention)
val HmsWarning = Color(0xFFD58B00)
val HmsWarningDark = Color(0xFFA66D00)
val HmsWarningLight = Color(0xFFECA31E)
val HmsWarningSubtle = Color(0xFFFAF3E5)

// Clinical Red (Critical / Emergency / Severe)
val HmsDanger = Color(0xFFD64545)
val HmsDangerDark = Color(0xFFA83434)
val HmsDangerLight = Color(0xFFE66E6E)
val HmsDangerSubtle = Color(0xFFFAEBEB)

// Surfaces & Canvas
val HmsBackground = Color(0xFFF5F8FB)
val HmsSurface = Color(0xFFFFFFFF)
val HmsSurfaceElevated = Color(0xFFFFFFFF)
val HmsSurfaceVariant = Color(0xFFEDF2F7)

// Typography & Contrast
val HmsTextPrimary = Color(0xFF17212B)
val HmsTextSecondary = Color(0xFF667684)
val HmsTextTertiary = Color(0xFF9BA7B4)
val HmsMuted = Color(0xFF667684)

val HmsBorder = Color(0xFFE2E8F0)
val HmsBorderLight = Color(0xFFF1F5F9)
val HmsDivider = Color(0xFFE2E8F0)

// Premium Clinical Brushes
val HmsHeroGradient = Brush.verticalGradient(
    colors = listOf(Color(0xFF123B5D), Color(0xFF1A4E78))
)

val HmsBlueGradient = Brush.horizontalGradient(
    colors = listOf(Color(0xFF1E6FD9), Color(0xFF1557AD))
)

val HmsSuccessGradient = Brush.horizontalGradient(
    colors = listOf(Color(0xFF159A67), Color(0xFF0F724C))
)

val HmsCardGradient = Brush.verticalGradient(
    colors = listOf(Color(0xFFFFFFFF), Color(0xFFF5F8FB))
)
