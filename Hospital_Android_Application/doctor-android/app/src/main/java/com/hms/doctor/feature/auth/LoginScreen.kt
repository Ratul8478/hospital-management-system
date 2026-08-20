package com.hms.doctor.feature.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hms.doctor.core.ui.components.HmsCard
import com.hms.doctor.core.ui.components.HmsPrimaryButton
import com.hms.doctor.core.ui.theme.*

@Composable
fun LoginScreen(
    viewModel: LoginViewModel,
    onLoginSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    var passwordVisible by remember { mutableStateOf(false) }
    val focusManager = LocalFocusManager.current
    val scrollState = rememberScrollState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(HmsBackground)
    ) {
        // Top Header Banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .background(HmsNavy)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 24.dp, vertical = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                    Surface(
                    modifier = Modifier.size(52.dp),
                    shape = CircleShape,
                    color = HmsBlue
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.AccountCircle,
                            contentDescription = "HMS Doctor Logo",
                            tint = HmsSurface,
                            modifier = Modifier.size(30.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Medix Doctor Pro",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = HmsSurface
                )
                Text(
                    text = "Clinical EHR & Hospital Management System",
                    fontSize = 12.sp,
                    color = HmsTealLight
                )
            }
        }

        // Form Card
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 160.dp)
                .verticalScroll(scrollState)
                .padding(horizontal = 20.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Mode Segmented Switcher: Sign In vs Doctor Registration
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = HmsSurface,
                shadowElevation = 2.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(4.dp)
                ) {
                    Button(
                        onClick = { viewModel.setAuthMode(false) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (!uiState.isRegisterMode) HmsNavy else Color.Transparent,
                            contentColor = if (!uiState.isRegisterMode) HmsSurface else HmsTextSecondary
                        ),
                        elevation = null
                    ) {
                        Icon(imageVector = Icons.Default.Lock, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Sign In", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }

                    Button(
                        onClick = { viewModel.setAuthMode(true) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (uiState.isRegisterMode) HmsNavy else Color.Transparent,
                            contentColor = if (uiState.isRegisterMode) HmsSurface else HmsTextSecondary
                        ),
                        elevation = null
                    ) {
                        Icon(imageVector = Icons.Default.Person, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Registration", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            HmsCard(
                modifier = Modifier.fillMaxWidth(),
                elevation = 2.dp,
                cornerRadius = 16.dp
            ) {
                Text(
                    text = if (uiState.isRegisterMode) "Doctor Registration" else "Doctor Authentication",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = HmsNavy
                )
                Text(
                    text = if (uiState.isRegisterMode) "Register your practitioner credentials with hospital reference ID" else "Sign in with your registered hospital credentials",
                    fontSize = 12.sp,
                    color = HmsTextSecondary,
                    modifier = Modifier.padding(top = 2.dp, bottom = 16.dp)
                )

                // Error alert if present
                if (uiState.errorMessage != null) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        shape = RoundedCornerShape(8.dp),
                        color = HmsDangerSubtle,
                        border = androidx.compose.foundation.BorderStroke(1.dp, HmsDanger.copy(alpha = 0.3f))
                    ) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Warning, contentDescription = null, tint = HmsDanger, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = uiState.errorMessage!!,
                                color = HmsDanger,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                // If Registration Mode: Extra Doctor Fields & Mandatory Reference ID
                if (uiState.isRegisterMode) {
                    OutlinedTextField(
                        value = uiState.registerName,
                        onValueChange = { viewModel.onRegisterNameChanged(it) },
                        label = { Text("Full Practitioner Name *") },
                        leadingIcon = {
                            Icon(imageVector = Icons.Default.Person, contentDescription = null, tint = HmsBlue)
                        },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.registerChamberAddress,
                        onValueChange = { viewModel.onRegisterChamberAddressChanged(it) },
                        label = { Text("Chamber Address *") },
                        leadingIcon = {
                            Icon(imageVector = Icons.Default.Home, contentDescription = null, tint = HmsBlue)
                        },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = uiState.registerPincode,
                            onValueChange = { viewModel.onRegisterPincodeChanged(it) },
                            label = { Text("Pin Code *") },
                            leadingIcon = {
                                Icon(imageVector = Icons.Default.Place, contentDescription = null, tint = HmsBlue)
                            },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        )

                        OutlinedTextField(
                            value = uiState.registerDistrict,
                            onValueChange = { viewModel.onRegisterDistrictChanged(it) },
                            label = { Text("District *") },
                            leadingIcon = {
                                Icon(imageVector = Icons.Default.LocationOn, contentDescription = null, tint = HmsBlue)
                            },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.registerState,
                        onValueChange = { viewModel.onRegisterStateChanged(it) },
                        label = { Text("State *") },
                        leadingIcon = {
                            Icon(imageVector = Icons.Default.Place, contentDescription = null, tint = HmsBlue)
                        },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Mandatory Doctor Reference ID / Referral Code
                    OutlinedTextField(
                        value = uiState.registerReferenceId,
                        onValueChange = { viewModel.onRegisterReferenceIdChanged(it) },
                        label = { Text("Reference ID * (Mandatory)") },
                        leadingIcon = {
                            Icon(imageVector = Icons.Default.Star, contentDescription = null, tint = HmsDanger)
                        },
                        supportingText = {
                            Text("Hospital Reference ID is required for doctor verification", fontSize = 10.sp, color = HmsTextSecondary)
                        },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = HmsDanger,
                            unfocusedBorderColor = HmsDanger.copy(alpha = 0.5f)
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))
                }

                // Email Input
                OutlinedTextField(
                    value = uiState.email,
                    onValueChange = { viewModel.onEmailChanged(it) },
                    label = { Text(if (uiState.isRegisterMode) "Email *" else "Doctor Email Address") },
                    leadingIcon = {
                        Icon(imageVector = Icons.Default.Email, contentDescription = "Email", tint = HmsBlue)
                    },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Email,
                        imeAction = ImeAction.Next
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Password Input
                OutlinedTextField(
                    value = uiState.password,
                    onValueChange = { viewModel.onPasswordChanged(it) },
                    label = { Text(if (uiState.isRegisterMode) "Create Master Access Password *" else "Password") },
                    leadingIcon = {
                        Icon(imageVector = Icons.Default.Lock, contentDescription = "Password", tint = HmsBlue)
                    },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                imageVector = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = "Toggle Password Visibility",
                                tint = HmsTextSecondary
                            )
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Password,
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            focusManager.clearFocus()
                            if (uiState.isRegisterMode) {
                                viewModel.registerDoctor(onLoginSuccess)
                            } else {
                                viewModel.login(onLoginSuccess)
                            }
                        }
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Submit Button
                HmsPrimaryButton(
                    text = if (uiState.isRegisterMode) "Register & Open Medix Portal" else "Secure Sign In",
                    onClick = {
                        focusManager.clearFocus()
                        if (uiState.isRegisterMode) {
                            viewModel.registerDoctor(onLoginSuccess)
                        } else {
                            viewModel.login(onLoginSuccess)
                        }
                    },
                    isLoading = uiState.isLoading
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Protected by Enterprise Sanctum Authentication & HIPAA Compliance",
                fontSize = 11.sp,
                color = HmsTextSecondary,
                textAlign = TextAlign.Center
            )
        }
    }
}
