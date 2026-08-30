package com.example.realtime

import com.example.model.ConnectionState
import com.example.model.DeliveryTask
import com.example.model.RealtimeLog
import com.example.model.TaskStatus
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class RealtimeSocketEngine(
    private val scope: CoroutineScope = CoroutineScope(Dispatchers.Default)
) {
    private val timeFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())

    private val _connectionState = MutableStateFlow(ConnectionState.CONNECTED)
    val connectionState: StateFlow<ConnectionState> = _connectionState.asStateFlow()

    private val _tasks = MutableStateFlow<List<DeliveryTask>>(initialData())
    val tasks: StateFlow<List<DeliveryTask>> = _tasks.asStateFlow()

    private val _offlineQueue = MutableStateFlow<List<Pair<String, TaskStatus>>>(emptyList())
    val offlineQueue: StateFlow<List<Pair<String, TaskStatus>>> = _offlineQueue.asStateFlow()

    private val _eventLogs = MutableStateFlow<List<RealtimeLog>>(emptyList())
    val eventLogs: StateFlow<List<RealtimeLog>> = _eventLogs.asStateFlow()

    init {
        logEvent("socket:connect", "WebSocket connected: ws://reflex.io/rider/RIDER-05")
    }

    fun setConnection(online: Boolean) {
        if (online && _connectionState.value == ConnectionState.OFFLINE) {
            _connectionState.value = ConnectionState.SYNCING
            logEvent("socket:reconnecting", "Reconnecting to Reflex server...")
            scope.launch {
                delay(600)
                _connectionState.value = ConnectionState.CONNECTED
                logEvent("socket:reconnected", "Signal restored. Flushing offline queue.")
                flushOfflineQueue()
            }
        } else if (!online && _connectionState.value != ConnectionState.OFFLINE) {
            _connectionState.value = ConnectionState.OFFLINE
            logEvent("socket:disconnect", "Signal lost. Offline queue active.")
        }
    }

    fun updateTaskStatus(taskId: String, newStatus: TaskStatus) {
        val currentConn = _connectionState.value
        if (currentConn == ConnectionState.OFFLINE) {
            // Queue offline
            _offlineQueue.update { it + (taskId to newStatus) }
            _tasks.update { list ->
                list.map { task ->
                    if (task.id == taskId) {
                        task.copy(
                            status = newStatus,
                            isQueuedOffline = true,
                            updatedAt = System.currentTimeMillis()
                        )
                    } else task
                }
            }
            logEvent("offline:queued", "Action saved locally [$taskId -> ${newStatus.label}]")
        } else {
            // Instant real-time broadcast
            _tasks.update { list ->
                list.map { task ->
                    if (task.id == taskId) {
                        task.copy(
                            status = newStatus,
                            isQueuedOffline = false,
                            conflictReason = null,
                            updatedAt = System.currentTimeMillis()
                        )
                    } else task
                }
            }
            logEvent("delivery:update", "Sent: $taskId -> ${newStatus.label} (ack: 200)")
        }
    }

    private fun flushOfflineQueue() {
        val queue = _offlineQueue.value
        if (queue.isEmpty()) return

        scope.launch {
            queue.forEach { (taskId, status) ->
                delay(200)
                _tasks.update { list ->
                    list.map { task ->
                        if (task.id == taskId) {
                            task.copy(
                                status = status,
                                isQueuedOffline = false,
                                updatedAt = System.currentTimeMillis()
                            )
                        } else task
                    }
                }
                logEvent("socket:sync", "Synced offline action [$taskId -> ${status.label}]")
            }
            _offlineQueue.value = emptyList()
            logEvent("socket:synced", "All queued updates synchronized.")
        }
    }

    fun simulateConcurrentCollision(taskId: String) {
        scope.launch {
            logEvent("socket:inbound", "Dispatcher assigned $taskId to RIDER-02 concurrently")
            _tasks.update { list ->
                list.map { task ->
                    if (task.id == taskId) {
                        task.copy(
                            status = TaskStatus.CONFLICT,
                            conflictReason = "Collision: Re-assigned by Dispatcher #2"
                        )
                    } else task
                }
            }
        }
    }

    fun resolveConflict(taskId: String, claim: Boolean) {
        scope.launch {
            if (claim) {
                _tasks.update { list ->
                    list.map { task ->
                        if (task.id == taskId) {
                            task.copy(
                                status = TaskStatus.ASSIGNED,
                                conflictReason = null,
                                riderId = "RIDER-05",
                                updatedAt = System.currentTimeMillis()
                            )
                        } else task
                    }
                }
                logEvent("conflict:resolved", "Claimed lock for $taskId (RIDER-05 priority)")
            } else {
                _tasks.update { list ->
                    list.filterNot { it.id == taskId }
                }
                logEvent("conflict:released", "Released $taskId to RIDER-02")
            }
        }
    }

    fun simulateNewInboundTask() {
        scope.launch {
            val codeNum = (1000..9999).random()
            val randomDist = String.format(Locale.US, "%.1f", (5..85).random() / 10.0).toDouble()
            val randomWeight = String.format(Locale.US, "%.1f", (3..65).random() / 10.0).toDouble()
            val randomEta = (randomDist * 3.5).toInt().coerceAtLeast(3)
            val newTask = DeliveryTask(
                id = "DEL-$codeNum",
                code = "RFX-$codeNum",
                customer = listOf("Alex K.", "Sarah M.", "David O.", "Elena V.", "Liam T.", "Marcus Chen", "Chloe Bennett", "Jordan Miller").random(),
                address = listOf("84 Market St", "12 Kingsway Blvd", "504 Broadway, Fl 4", "77 Elm Park Ave", "92 South Ave, Bay 2", "144 Silicon Way", "607 Waterfront Dr").random(),
                item = listOf("Medical Lab Sample", "High-Priority Contract", "Express Electronics", "Fresh Organic Produce", "Replacement Sensor Unit", "Precision Tools").random(),
                status = TaskStatus.ASSIGNED,
                qrCode = "QR-RFX-$codeNum",
                distanceKm = randomDist,
                weightKg = randomWeight,
                etaMinutes = randomEta
            )
            _tasks.update { listOf(newTask) + it }
            logEvent("socket:inbound", "New delivery assigned: ${newTask.code}")
        }
    }

    private fun logEvent(event: String, detail: String) {
        val log = RealtimeLog(
            id = UUID.randomUUID().toString(),
            event = event,
            time = timeFormat.format(Date()),
            detail = detail
        )
        _eventLogs.update { (listOf(log) + it).take(30) }
    }

    private fun initialData(): List<DeliveryTask> = listOf(
        DeliveryTask(
            id = "DEL-4102",
            code = "RFX-4102",
            customer = "Michael Chen",
            address = "742 Evergreen Terrace",
            item = "Urgent Lab Sample",
            status = TaskStatus.ASSIGNED,
            qrCode = "QR-RFX-4102",
            distanceKm = 1.4,
            weightKg = 0.8,
            etaMinutes = 5
        ),
        DeliveryTask(
            id = "DEL-3891",
            code = "RFX-3891",
            customer = "Emma Watson",
            address = "120 4th Ave, Suite 3B",
            item = "Secure Doc Envelope",
            status = TaskStatus.PICKED_UP,
            qrCode = "QR-RFX-3891",
            distanceKm = 3.2,
            weightKg = 1.5,
            etaMinutes = 11
        ),
        DeliveryTask(
            id = "DEL-3210",
            code = "RFX-3210",
            customer = "Marcus Vance",
            address = "88 Industrial Park Rd",
            item = "Precision Tooling Kit",
            status = TaskStatus.IN_TRANSIT,
            qrCode = "QR-RFX-3210",
            distanceKm = 6.7,
            weightKg = 4.8,
            etaMinutes = 22
        ),
        DeliveryTask(
            id = "DEL-2940",
            code = "RFX-2940",
            customer = "Sophia Taylor",
            address = "315 Pine Valley Rd",
            item = "Express Pharmacy Box",
            status = TaskStatus.DELIVERED,
            qrCode = "QR-RFX-2940",
            distanceKm = 8.5,
            weightKg = 2.1,
            etaMinutes = 28
        )
    )
}
