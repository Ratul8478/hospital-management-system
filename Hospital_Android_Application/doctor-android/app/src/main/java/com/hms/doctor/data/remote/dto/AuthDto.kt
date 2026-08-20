package com.hms.doctor.data.remote.dto

import com.google.gson.annotations.SerializedName

data class LoginRequestDto(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String? = null,
    @SerializedName("clientPlatform") val clientPlatform: String = "android-doctor"
)

data class LoginResponseDataDto(
    @SerializedName("token") val token: String,
    @SerializedName("tokenType") val tokenType: String = "Bearer",
    @SerializedName("expiresAt") val expiresAt: String? = null,
    @SerializedName("user") val user: UserDto,
    @SerializedName("permissions") val permissions: List<String>? = null
)

data class UserDto(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("specialty") val specialty: String? = null,
    @SerializedName("department") val department: String? = null,
    @SerializedName("qualification") val qualification: String? = null,
    @SerializedName("registrationNumber") val registrationNumber: String? = null,
    @SerializedName("branchId") val branchId: Int = 1,
    @SerializedName("branchCode") val branchCode: String? = null,
    @SerializedName("branchName") val branchName: String? = null,
    @SerializedName("fee") val fee: Double = 0.0,
    @SerializedName("status") val status: String = "AVAILABLE",
    @SerializedName("role") val role: String = "doctor",
    @SerializedName("avatarUrl") val avatarUrl: String? = null
)
