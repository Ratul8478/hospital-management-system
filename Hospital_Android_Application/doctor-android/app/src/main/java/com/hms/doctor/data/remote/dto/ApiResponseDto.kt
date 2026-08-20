package com.hms.doctor.data.remote.dto

import com.google.gson.annotations.SerializedName

data class ApiResponseDto<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String? = null,
    @SerializedName("data") val data: T? = null,
    @SerializedName("statusCode") val statusCode: Int? = null,
    @SerializedName("meta") val meta: Map<String, Any>? = null
)
