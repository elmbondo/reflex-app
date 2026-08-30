package com.example.model

enum class TaskStatus(val label: String) {
    ASSIGNED("Assigned"),
    PICKED_UP("Picked Up"),
    IN_TRANSIT("In Transit"),
    DELIVERED("Delivered"),
    CONFLICT("Conflict")
}

data class DeliveryTask(
    val id: String,
    val code: String,
    val customer: String,
    val address: String,
    val item: String,
    val status: TaskStatus = TaskStatus.ASSIGNED,
    val riderId: String = "RIDER-05",
    val qrCode: String,
    val distanceKm: Double = 1.8,
    val weightKg: Double = 1.2,
    val etaMinutes: Int = 8,
    val destLat: Double = 37.7749,
    val destLng: Double = -122.4194,
    val updatedAt: Long = System.currentTimeMillis(),
    val isQueuedOffline: Boolean = false,
    val conflictReason: String? = null
)

enum class ConnectionState {
    CONNECTED,
    OFFLINE,
    SYNCING
}

data class RealtimeLog(
    val id: String,
    val event: String,
    val time: String,
    val detail: String
)
