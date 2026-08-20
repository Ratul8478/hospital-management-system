package com.hms.doctor.feature.reports

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.doctor.core.common.NetworkResult
import com.hms.doctor.domain.model.DiagnosticReport
import com.hms.doctor.domain.model.ReportsSummary
import com.hms.doctor.domain.repository.ReportRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ReportsUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isNetworkError: Boolean = false,
    val selectedFilter: String = "ALL", // ALL, READY, PENDING, CRITICAL
    val summary: ReportsSummary? = null,
    val reports: List<DiagnosticReport> = emptyList(),
    val filteredReports: List<DiagnosticReport> = emptyList()
)

@HiltViewModel
class ReportsViewModel @Inject constructor(
    private val reportRepository: ReportRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ReportsUiState())
    val uiState: StateFlow<ReportsUiState> = _uiState.asStateFlow()

    init {
        loadReports()
    }

    fun loadReports() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = reportRepository.getReports()) {
                is NetworkResult.Success -> {
                    val summary = result.data.first
                    val reports = result.data.second
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            summary = summary,
                            reports = reports,
                            filteredReports = filterReports(reports, it.selectedFilter),
                            errorMessage = null
                        )
                    }
                }
                is NetworkResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = result.message,
                            isNetworkError = result.isNetworkError
                        )
                    }
                }
                is NetworkResult.Loading -> {}
            }
        }
    }

    fun setFilter(filter: String) {
        _uiState.update {
            it.copy(
                selectedFilter = filter,
                filteredReports = filterReports(it.reports, filter)
            )
        }
    }

    private fun filterReports(list: List<DiagnosticReport>, filter: String): List<DiagnosticReport> {
        return when (filter) {
            "ALL" -> list
            "READY" -> list.filter { it.status.equals("ready", ignoreCase = true) }
            "PENDING" -> list.filter { it.status.equals("pending", ignoreCase = true) || it.status.equals("processing", ignoreCase = true) }
            "CRITICAL" -> list.filter { it.criticalAlert }
            else -> list
        }
    }
}
