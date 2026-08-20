package com.hms.doctor.core.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.hms.doctor.core.ui.theme.*
import com.hms.doctor.domain.model.HospitalReferral

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HmsReferralDialog(
    patientName: String,
    uhid: String,
    patientAge: Int = 45,
    patientGender: String = "Male",
    diagnosis: String = "Cardiovascular Evaluation",
    vitalsSummary: String = "BP: 138/88 mmHg • HR: 78 BPM • SpO2: 98%",
    onDismiss: () -> Unit,
    onReferralDispatched: (HospitalReferral) -> Unit
) {
    val hospitalsWithDoctors = listOf(
        Pair("ARIYAN HOSPITAL MULTISPECIALITY (Kolkata HQ)", listOf("Dr . Jiarul Haque (General & Cardiology)", "Dr. Sarah Williams (Cardiology Specialist)")),
        Pair("Medix Specialty & Trauma Center (Bengaluru South)", listOf("Dr. Suresh Verma (Trauma & Orthopedic Surgery)")),
        Pair("Medix Mother & Child Super-Specialty (Delhi North)", listOf("Dr. Shalini Gupta (Obstetrics & Pediatrics)")),
        Pair("Medix Daycare & Diagnostic Satellite Hub (Pune West)", listOf("Dr. Meera Joshi (Pathology & Internal Medicine)")),
        Pair("Medix Cardiac & Neuro Institute (Kolkata East)", listOf("Dr. Alok Banerjee (Neurosurgery & Critical Care)")),
        Pair("Medix Advanced Oncology Care Center (Hyderabad Central)", listOf("Dr. K. Srinivas Rao (Medical & Surgical Oncology)")),
        Pair("Medix Regional Wellness & Nephrology Clinic (Guwahati)", listOf("Dr. Bipin Sarma (Nephrology & Renal Care)")),
        Pair("Medix Coastal Orthopedic & Rehab Institute (Chennai)", listOf("Dr. R. Natarajan (Joint Replacement & Spine)"))
    )

    val departments = listOf(
        "Cardiology & Interventional Cath Lab",
        "Critical Care & Intensive Care Unit (ICU)",
        "General & Cardiology Medicine",
        "Trauma & Orthopedic Surgery",
        "Obstetrics, Gynecology & Pediatrics",
        "Neurology & Neurosurgery",
        "Nephrology & Renal Dialysis",
        "Medical & Surgical Oncology",
        "Emergency Triage & Acute Care"
    )

    val urgencyLevels = listOf("ROUTINE", "URGENT", "EMERGENCY")

    var selectedHospitalIndex by remember { mutableIntStateOf(0) }
    val selectedHospital = hospitalsWithDoctors[selectedHospitalIndex].first
    val currentHospitalDoctors = hospitalsWithDoctors[selectedHospitalIndex].second
    var selectedDoctor by remember(selectedHospitalIndex) { mutableStateOf(currentHospitalDoctors.firstOrNull() ?: "Dr . Jiarul Haque") }

    var selectedDept by remember { mutableStateOf(departments[0]) }
    var selectedUrgency by remember { mutableStateOf(urgencyLevels[2]) } // Emergency default
    var clinicalNotes by remember {
        mutableStateOf("Patient presenting with acute chest tightness and critical cardiac biomarkers. Referred for immediate tertiary angiography and higher-level cath lab intervention.")
    }
    var isDispatched by remember { mutableStateOf(false) }
    var generatedToken by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.90f),
            shape = RoundedCornerShape(16.dp),
            color = HmsSurface,
            shadowElevation = 8.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = HmsBlue.copy(alpha = 0.15f),
                            modifier = Modifier.size(40.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(imageVector = Icons.Default.Send, contentDescription = null, tint = HmsBlue)
                            }
                        }
                        Column {
                            Text(
                                text = "Refer to City Hospital",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = HmsNavy
                            )
                            Text(
                                text = "Inter-Hospital Telemetry & Patient Transfer",
                                fontSize = 11.sp,
                                color = HmsTextSecondary
                            )
                        }
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = HmsTextSecondary)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = HmsBorder)
                Spacer(modifier = Modifier.height(14.dp))

                if (isDispatched) {
                    // Success Confirmation View
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(scrollState),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Surface(
                            shape = RoundedCornerShape(50.dp),
                            color = HmsSuccess.copy(alpha = 0.15f),
                            modifier = Modifier.size(72.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = HmsSuccess, modifier = Modifier.size(42.dp))
                            }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Referral Dispatched Successfully!",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = HmsNavy
                        )
                        Text(
                            text = "Tracking Token: $generatedToken",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = HmsBlue,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                        HmsCard(
                            modifier = Modifier.fillMaxWidth(),
                            backgroundColor = HmsBackground
                        ) {
                            Text(text = "Receiving Hospital:", fontSize = 11.sp, color = HmsTextSecondary)
                            Text(text = selectedHospital, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = HmsNavy)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(text = "Patient Details Transmitted:", fontSize = 11.sp, color = HmsTextSecondary)
                            Text(text = "$patientName ($uhid) • Vitals & EHR Handover Synced", fontSize = 12.sp, color = HmsTextPrimary)
                        }
                        Spacer(modifier = Modifier.height(20.dp))
                        HmsPrimaryButton(
                            text = "Done / Close Referral",
                            onClick = onDismiss
                        )
                    }
                } else {
                    // Referral Form
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .verticalScroll(scrollState),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        // Patient Summary Banner
                        HmsCard(
                            modifier = Modifier.fillMaxWidth(),
                            backgroundColor = HmsNavy
                        ) {
                            Text(text = "PATIENT BEING REFERRED", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HmsTealLight)
                            Text(text = patientName, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = HmsSurface)
                            Text(text = "$uhid • $patientAge Y / $patientGender", fontSize = 11.sp, color = HmsSurface.copy(alpha = 0.8f))
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = vitalsSummary, fontSize = 11.sp, color = HmsTealLight)
                        }

                        // Target Hospital Dropdown selection
                        Text(text = "Select Target Hospital (Super Admin Approved) *", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = HmsNavy)
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            hospitalsWithDoctors.forEachIndexed { index, pair ->
                                val hosp = pair.first
                                Surface(
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (selectedHospitalIndex == index) HmsBlue.copy(alpha = 0.12f) else HmsBackground,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, if (selectedHospitalIndex == index) HmsBlue else HmsBorder),
                                    onClick = { selectedHospitalIndex = index }
                                ) {
                                    Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
                                        RadioButton(
                                            selected = selectedHospitalIndex == index,
                                            onClick = { selectedHospitalIndex = index },
                                            colors = RadioButtonDefaults.colors(selectedColor = HmsBlue)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(text = hosp, fontSize = 12.sp, color = HmsNavy, fontWeight = FontWeight.Medium)
                                    }
                                }
                            }
                        }

                        // Target Available Doctor Selection
                        Text(text = "Available Specialist Doctor at Hospital *", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = HmsNavy)
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            currentHospitalDoctors.forEach { docName ->
                                Surface(
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (selectedDoctor == docName) HmsTeal.copy(alpha = 0.12f) else HmsBackground,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, if (selectedDoctor == docName) HmsTeal else HmsBorder),
                                    onClick = { selectedDoctor = docName }
                                ) {
                                    Row(modifier = Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
                                        RadioButton(
                                            selected = selectedDoctor == docName,
                                            onClick = { selectedDoctor = docName },
                                            colors = RadioButtonDefaults.colors(selectedColor = HmsTeal)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(text = docName, fontSize = 12.sp, color = HmsNavy, fontWeight = FontWeight.SemiBold)
                                    }
                                }
                            }
                        }

                        // Urgency Selection
                        Text(text = "Referral Urgency Level *", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = HmsNavy)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            FilterChip(
                                selected = selectedUrgency == "ROUTINE",
                                onClick = { selectedUrgency = "ROUTINE" },
                                label = { Text("Routine (3-5d)", fontSize = 11.sp) }
                            )
                            FilterChip(
                                selected = selectedUrgency == "URGENT",
                                onClick = { selectedUrgency = "URGENT" },
                                label = { Text("Urgent (24h)", fontSize = 11.sp) }
                            )
                            FilterChip(
                                selected = selectedUrgency == "EMERGENCY",
                                onClick = { selectedUrgency = "EMERGENCY" },
                                label = { Text("Code Red ICU", fontSize = 11.sp, color = if (selectedUrgency == "EMERGENCY") HmsDanger else HmsTextPrimary) }
                            )
                        }

                        // Clinical Notes
                        Text(text = "Clinical Handover Notes *", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = HmsNavy)
                        OutlinedTextField(
                            value = clinicalNotes,
                            onValueChange = { clinicalNotes = it },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 3,
                            shape = RoundedCornerShape(10.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Action buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Cancel", color = HmsTextSecondary)
                        }

                        Button(
                            onClick = {
                                val token = "REF-HOSP-2026-${(10000..99999).random()}"
                                generatedToken = token
                                val referral = HospitalReferral(
                                    referralId = token,
                                    patientId = 1,
                                    uhid = uhid,
                                    patientName = patientName,
                                    patientAge = patientAge,
                                    patientGender = patientGender,
                                    targetHospitalId = "HOSP-${selectedHospital.take(6).uppercase()}",
                                    targetHospitalName = selectedHospital,
                                    targetDoctorName = selectedDoctor,
                                    targetDepartment = selectedDept,
                                    urgencyLevel = selectedUrgency,
                                    clinicalSummary = clinicalNotes,
                                    diagnosis = diagnosis,
                                    vitalsSummary = vitalsSummary,
                                    referringDoctorId = 1,
                                    referringDoctorName = "Dr. Sarah Williams",
                                    timestamp = "Today",
                                    status = "DISPATCHED"
                                )
                                onReferralDispatched(referral)
                                isDispatched = true
                            },
                            modifier = Modifier.weight(2f),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = HmsBlue)
                        ) {
                            Icon(imageVector = Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Dispatch Referral", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
