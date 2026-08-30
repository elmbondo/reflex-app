package com.example.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.model.ConnectionState
import com.example.model.DeliveryTask
import com.example.model.RealtimeLog
import com.example.model.TaskStatus
import com.example.realtime.RealtimeSocketEngine
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

enum class TaskFilter(val label: String) {
    ACTIVE("Active"),
    ALL("All"),
    COMPLETED("Done")
}

class RiderViewModel(
    private val socketEngine: RealtimeSocketEngine = RealtimeSocketEngine()
) : ViewModel() {

    val connectionState: StateFlow<ConnectionState> = socketEngine.connectionState
    val tasks: StateFlow<List<DeliveryTask>> = socketEngine.tasks
    val eventLogs: StateFlow<List<RealtimeLog>> = socketEngine.eventLogs

    private val _selectedFilter = MutableStateFlow(TaskFilter.ACTIVE)
    val selectedFilter: StateFlow<TaskFilter> = _selectedFilter.asStateFlow()

    private val _activeScanningTask = MutableStateFlow<DeliveryTask?>(null)
    val activeScanningTask: StateFlow<DeliveryTask?> = _activeScanningTask.asStateFlow()

    private val _scanFeedback = MutableStateFlow<String?>(null)
    val scanFeedback: StateFlow<String?> = _scanFeedback.asStateFlow()

    private val _isMapOpen = MutableStateFlow(false)
    val isMapOpen: StateFlow<Boolean> = _isMapOpen.asStateFlow()

    private val _selectedMapTask = MutableStateFlow<DeliveryTask?>(null)
    val selectedMapTask: StateFlow<DeliveryTask?> = _selectedMapTask.asStateFlow()

    val offlineQueueCount: StateFlow<Int> = socketEngine.offlineQueue
        .map { it.size }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val filteredTasks: StateFlow<List<DeliveryTask>> = combine(tasks, selectedFilter) { list, filter ->
        when (filter) {
            TaskFilter.ACTIVE -> list.filter { it.status != TaskStatus.DELIVERED }
            TaskFilter.ALL -> list
            TaskFilter.COMPLETED -> list.filter { it.status == TaskStatus.DELIVERED }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun setFilter(filter: TaskFilter) {
        _selectedFilter.value = filter
    }

    fun toggleNetwork() {
        val current = connectionState.value
        socketEngine.setConnection(current == ConnectionState.OFFLINE)
    }

    fun updateStatus(taskId: String, newStatus: TaskStatus) {
        socketEngine.updateTaskStatus(taskId, newStatus)
    }

    fun startQrScan(task: DeliveryTask) {
        _activeScanningTask.value = task
        _scanFeedback.value = null
    }

    fun dismissQrScan() {
        _activeScanningTask.value = null
        _scanFeedback.value = null
    }

    fun onQrScanned(code: String) {
        val target = _activeScanningTask.value ?: return
        if (code == target.qrCode || code == target.code) {
            val nextStatus = when (target.status) {
                TaskStatus.ASSIGNED -> TaskStatus.PICKED_UP
                TaskStatus.PICKED_UP -> TaskStatus.IN_TRANSIT
                TaskStatus.IN_TRANSIT -> TaskStatus.DELIVERED
                else -> target.status
            }
            socketEngine.updateTaskStatus(target.id, nextStatus)
            _scanFeedback.value = "Verified: ${target.code}"
            _activeScanningTask.value = null
        } else {
            _scanFeedback.value = "Invalid QR: $code"
        }
    }

    fun openMap(task: DeliveryTask? = null) {
        _selectedMapTask.value = task
        _isMapOpen.value = true
    }

    fun closeMap() {
        _isMapOpen.value = false
        _selectedMapTask.value = null
    }

    fun simulateCollision(taskId: String) {
        socketEngine.simulateConcurrentCollision(taskId)
    }

    fun resolveCollision(taskId: String, claim: Boolean) {
        socketEngine.resolveConflict(taskId, claim)
    }

    fun simulateInboundTask() {
        socketEngine.simulateNewInboundTask()
    }
}
