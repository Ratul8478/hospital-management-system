package com.hms.doctor.core.auth

import com.hms.doctor.core.common.Constants
import com.hms.doctor.core.storage.EncryptedPreferencesManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SessionManager @Inject constructor(
    private val prefs: EncryptedPreferencesManager
) {
    private val _isLoggedIn = MutableStateFlow(hasValidToken())
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    fun getToken(): String? {
        return prefs.getString(Constants.KEY_ACCESS_TOKEN)
    }

    fun hasValidToken(): Boolean {
        val token = prefs.getString(Constants.KEY_ACCESS_TOKEN)
        return !token.isNullOrBlank()
    }

    fun saveSession(
        token: String,
        doctorId: Int,
        doctorName: String,
        doctorEmail: String,
        specialty: String,
        department: String,
        branchId: Int,
        branchName: String
    ) {
        prefs.saveString(Constants.KEY_ACCESS_TOKEN, token)
        prefs.saveInt(Constants.KEY_DOCTOR_ID, doctorId)
        prefs.saveString(Constants.KEY_DOCTOR_NAME, doctorName)
        prefs.saveString(Constants.KEY_DOCTOR_EMAIL, doctorEmail)
        prefs.saveString(Constants.KEY_DOCTOR_SPECIALTY, specialty)
        prefs.saveString(Constants.KEY_DOCTOR_DEPARTMENT, department)
        prefs.saveInt(Constants.KEY_BRANCH_ID, branchId)
        prefs.saveString(Constants.KEY_BRANCH_NAME, branchName)
        _isLoggedIn.value = true
    }

    fun getDoctorId(): Int {
        return prefs.getInt(Constants.KEY_DOCTOR_ID, 99)
    }

    fun getDoctorName(): String {
        return prefs.getString(Constants.KEY_DOCTOR_NAME, "Dr. Sarah Williams") ?: "Dr. Sarah Williams"
    }

    fun getDepartment(): String {
        return prefs.getString(Constants.KEY_DOCTOR_DEPARTMENT, "Cardiology") ?: "Cardiology"
    }

    fun getSpecialty(): String {
        return prefs.getString(Constants.KEY_DOCTOR_SPECIALTY, "Cardiologist") ?: "Cardiologist"
    }

    fun getDoctorEmail(): String {
        return prefs.getString(Constants.KEY_DOCTOR_EMAIL, "doctor@medix.local") ?: "doctor@medix.local"
    }

    fun getBranchId(): Int {
        return prefs.getInt(Constants.KEY_BRANCH_ID, 1)
    }

    fun clearSession() {
        prefs.clearAll()
        _isLoggedIn.value = false
    }
}
