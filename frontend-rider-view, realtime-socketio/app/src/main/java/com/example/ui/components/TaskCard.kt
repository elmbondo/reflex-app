package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DirectionsRun
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.NearMe
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.DeliveryTask
import com.example.model.TaskStatus
import com.example.ui.theme.CleanMinBorder
import com.example.ui.theme.CleanMinBorderLight
import com.example.ui.theme.CleanMinDistanceBadge
import com.example.ui.theme.CleanMinDistanceContainer
import com.example.ui.theme.CleanMinError
import com.example.ui.theme.CleanMinErrorContainer
import com.example.ui.theme.CleanMinOnPackageContainer
import com.example.ui.theme.CleanMinPackageContainer
import com.example.ui.theme.CleanMinPrimary
import com.example.ui.theme.CleanMinPrimaryContainer
import com.example.ui.theme.CleanMinSuccess
import com.example.ui.theme.CleanMinSuccessContainer
import com.example.ui.theme.CleanMinTextPrimary
import com.example.ui.theme.CleanMinTextSecondary
import com.example.ui.theme.CleanMinTextTertiary
import com.example.ui.theme.CleanMinWarning
import com.example.ui.theme.CleanMinWarningContainer

@Composable
fun TaskCard(
    task: DeliveryTask,
    onAdvanceStatus: (TaskStatus) -> Unit,
    onStartScan: () -> Unit,
    onSimulateCollision: () -> Unit,
    onResolveCollision: (Boolean) -> Unit,
    onOpenMap: ((DeliveryTask) -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val (statusBadgeBg, statusBadgeText) = when (task.status) {
        TaskStatus.ASSIGNED -> Pair(CleanMinPrimaryContainer, CleanMinPrimary)
        TaskStatus.PICKED_UP -> Pair(CleanMinPrimaryContainer, CleanMinPrimary)
        TaskStatus.IN_TRANSIT -> Pair(CleanMinDistanceContainer, CleanMinDistanceBadge)
        TaskStatus.DELIVERED -> Pair(CleanMinSuccessContainer, CleanMinSuccess)
        TaskStatus.CONFLICT -> Pair(CleanMinErrorContainer, CleanMinError)
    }

    val stepIndex = when (task.status) {
        TaskStatus.ASSIGNED -> 0
        TaskStatus.PICKED_UP -> 1
        TaskStatus.IN_TRANSIT -> 2
        TaskStatus.DELIVERED -> 3
        TaskStatus.CONFLICT -> -1
    }

    Surface(
        shape = RoundedCornerShape(24.dp),
        color = Color.White,
        shadowElevation = 2.dp,
        modifier = modifier
            .fillMaxWidth()
            .border(
                1.dp,
                if (task.status == TaskStatus.CONFLICT) CleanMinError else CleanMinBorderLight,
                RoundedCornerShape(24.dp)
            )
            .testTag("task_card_${task.id}")
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            // Header Row: Package Icon in violet container & Task Info + Status
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(CleanMinPackageContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Inventory2,
                            contentDescription = "Package",
                            tint = CleanMinOnPackageContainer,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "TASK #${task.code.replace("TSK-", "").replace("RFX-", "")}",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = CleanMinTextPrimary,
                                letterSpacing = 0.5.sp
                            )
                            if (task.isQueuedOffline) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(CleanMinWarningContainer)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "QUEUED",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = CleanMinWarning
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(3.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Express Dispatch",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                                color = CleanMinTextSecondary
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            // Dynamic Weight Badge
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = CleanMinPackageContainer
                            ) {
                                Text(
                                    text = "${task.weightKg} kg",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = CleanMinOnPackageContainer,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 1.5.dp)
                                )
                            }
                        }
                    }
                }

                Column(horizontalAlignment = Alignment.End) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = statusBadgeBg
                        ) {
                            Text(
                                text = task.status.label,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = statusBadgeText,
                                modifier = Modifier.padding(horizontal = 11.dp, vertical = 4.dp)
                            )
                        }

                        if (task.status != TaskStatus.DELIVERED && task.status != TaskStatus.CONFLICT) {
                            IconButton(
                                onClick = onSimulateCollision,
                                modifier = Modifier
                                    .size(30.dp)
                                    .padding(start = 4.dp)
                                    .testTag("collision_test_${task.id}")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.WarningAmber,
                                    contentDescription = "Simulate Conflict",
                                    tint = CleanMinTextSecondary,
                                    modifier = Modifier.size(17.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Stepper timeline for active stages
            if (task.status != TaskStatus.CONFLICT) {
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val steps = listOf("Assigned", "Picked Up", "In Transit", "Delivered")
                    steps.forEachIndexed { idx, label ->
                        val isDone = idx <= stepIndex
                        val isCurrent = idx == stepIndex
                        val stepColor by animateColorAsState(
                            targetValue = when {
                                idx < stepIndex -> CleanMinSuccess
                                isCurrent -> CleanMinPrimary
                                else -> CleanMinBorder
                            },
                            label = "stepColor_$idx"
                        )

                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.weight(1f)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                // Left line
                                if (idx > 0) {
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(3.dp)
                                            .background(if (idx <= stepIndex) CleanMinPrimary else CleanMinBorderLight)
                                    )
                                } else {
                                    Spacer(modifier = Modifier.weight(1f))
                                }

                                // Step Circle
                                Box(
                                    modifier = Modifier
                                        .size(24.dp)
                                        .clip(CircleShape)
                                        .background(
                                            if (isDone) stepColor else Color.White
                                        )
                                        .border(2.dp, stepColor, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    if (idx < stepIndex) {
                                        Icon(
                                            imageVector = Icons.Default.Check,
                                            contentDescription = "Completed",
                                            tint = Color.White,
                                            modifier = Modifier.size(14.dp)
                                        )
                                    } else if (isCurrent) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .clip(CircleShape)
                                                .background(Color.White)
                                        )
                                    } else {
                                        Text(
                                            text = "${idx + 1}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = CleanMinTextTertiary
                                        )
                                    }
                                }

                                // Right line
                                if (idx < steps.size - 1) {
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(3.dp)
                                            .background(if (idx < stepIndex) CleanMinPrimary else CleanMinBorderLight)
                                    )
                                } else {
                                    Spacer(modifier = Modifier.weight(1f))
                                }
                            }

                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = label,
                                fontSize = 11.sp,
                                fontWeight = if (isCurrent) FontWeight.ExtraBold else FontWeight.Medium,
                                color = if (isCurrent) CleanMinPrimary else if (isDone) CleanMinTextPrimary else CleanMinTextTertiary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Pick up at label & Target Address / Hub
            Text(
                text = if (task.status == TaskStatus.ASSIGNED) "PICK UP LOCATION" else "DELIVERY DESTINATION",
                fontSize = 11.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 0.5.sp,
                color = CleanMinTextSecondary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = task.address,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = CleanMinTextPrimary,
                    lineHeight = 23.sp,
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(8.dp))

                // Dynamic Distance Pill (Clickable -> Opens Radar Map)
                Surface(
                    color = CleanMinDistanceContainer,
                    shape = RoundedCornerShape(10.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinDistanceBadge.copy(alpha = 0.3f)),
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .clickable { onOpenMap?.invoke(task) }
                        .testTag("distance_pill_${task.id}")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(horizontal = 9.dp, vertical = 5.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.NearMe,
                            contentDescription = "Map Distance",
                            tint = CleanMinDistanceBadge,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${task.distanceKm} km",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CleanMinDistanceBadge
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Item Name & Customer
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Item: ",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = CleanMinTextSecondary
                    )
                    Text(
                        text = task.item,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = CleanMinTextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                Text(
                    text = "• ${task.customer}",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = CleanMinTextSecondary
                )
            }

            Spacer(modifier = Modifier.height(14.dp))
            HorizontalDivider(color = CleanMinBorderLight, thickness = 1.dp)
            Spacer(modifier = Modifier.height(12.dp))

            // Bottom action & real-time sync status
            if (task.status == TaskStatus.CONFLICT) {
                // Conflict resolution block
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = "Conflict",
                            tint = CleanMinError,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = task.conflictReason ?: "Concurrent Assignment Collision",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = CleanMinError
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = { onResolveCollision(true) },
                            colors = ButtonDefaults.buttonColors(containerColor = CleanMinError),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp)
                                .testTag("claim_lock_${task.id}")
                        ) {
                            Text("Claim Priority", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                        OutlinedButton(
                            onClick = { onResolveCollision(false) },
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinBorder),
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp)
                                .testTag("release_lock_${task.id}")
                        ) {
                            Text(
                                "Release to Fleet",
                                fontSize = 13.sp,
                                color = CleanMinTextSecondary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            } else {
                Column(modifier = Modifier.fillMaxWidth()) {
                    // Real-time Sync & Live Map indicator strip
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            color = if (task.isQueuedOffline) CleanMinWarning.copy(alpha = 0.12f) else CleanMinPrimaryContainer.copy(alpha = 0.5f),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .clickable { onOpenMap?.invoke(task) }
                                .testTag("task_live_sync_chip_${task.id}")
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(7.dp)
                                        .clip(CircleShape)
                                        .background(if (task.isQueuedOffline) CleanMinWarning else CleanMinSuccess)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = if (task.isQueuedOffline) "Queued Offline" else "Live Dispatch Sync",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (task.isQueuedOffline) CleanMinWarning else CleanMinPrimary
                                )
                            }
                        }

                        // Live Map link
                        Surface(
                            color = Color.Transparent,
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .clickable { onOpenMap?.invoke(task) }
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "Radar Map",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = CleanMinPrimary
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Icon(
                                    imageVector = Icons.Default.Navigation,
                                    contentDescription = "View Map",
                                    tint = CleanMinPrimary,
                                    modifier = Modifier.size(13.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Action buttons row: Scan QR + Fully Visible Action Button
                    if (task.status != TaskStatus.DELIVERED) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // QR Scanner
                            OutlinedButton(
                                onClick = onStartScan,
                                shape = RoundedCornerShape(12.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinBorder),
                                colors = ButtonDefaults.outlinedButtonColors(
                                    containerColor = Color.White,
                                    contentColor = CleanMinTextPrimary
                                ),
                                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 0.dp),
                                modifier = Modifier
                                    .height(44.dp)
                                    .testTag("scan_qr_button_${task.id}")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.QrCodeScanner,
                                    contentDescription = "Scan",
                                    tint = CleanMinTextPrimary,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Scan QR",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = CleanMinTextPrimary
                                )
                            }

                            // Dynamic Action Button (Takes all remaining width so text is 100% visible)
                            val (actionLabel, actionIcon) = when (task.status) {
                                TaskStatus.ASSIGNED -> "Accept & Pick Up" to Icons.Default.DirectionsRun
                                TaskStatus.PICKED_UP -> "Start Delivery" to Icons.Default.LocalShipping
                                TaskStatus.IN_TRANSIT -> "Complete Drop" to Icons.Default.Check
                                else -> "Complete" to Icons.Default.Check
                            }

                            Button(
                                onClick = {
                                    val next = when (task.status) {
                                        TaskStatus.ASSIGNED -> TaskStatus.PICKED_UP
                                        TaskStatus.PICKED_UP -> TaskStatus.IN_TRANSIT
                                        TaskStatus.IN_TRANSIT -> TaskStatus.DELIVERED
                                        else -> task.status
                                    }
                                    onAdvanceStatus(next)
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = CleanMinPrimary,
                                    contentColor = Color.White
                                ),
                                shape = RoundedCornerShape(12.dp),
                                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 0.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .height(44.dp)
                                    .testTag("advance_status_button_${task.id}")
                            ) {
                                Icon(
                                    imageVector = actionIcon,
                                    contentDescription = actionLabel,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = actionLabel,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    } else {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = CleanMinSuccessContainer,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 11.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = "Delivered",
                                    tint = CleanMinSuccess,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Delivery Completed",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = CleanMinSuccess
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
