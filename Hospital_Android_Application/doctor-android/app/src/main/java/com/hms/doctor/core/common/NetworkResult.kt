package com.hms.doctor.core.common

sealed class NetworkResult<out T> {
    data class Success<out T>(val data: T, val message: String? = null) : NetworkResult<T>()
    data class Error(val message: String, val statusCode: Int? = null, val isNetworkError: Boolean = false) : NetworkResult<Nothing>()
    object Loading : NetworkResult<Nothing>()
}
