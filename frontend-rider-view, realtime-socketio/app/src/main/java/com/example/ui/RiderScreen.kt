package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inbox
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.TaskStatus
import com.example.ui.components.LiveRouteMapModal
import com.example.ui.components.QrScannerModal
import com.example.ui.components.RealtimeEventStream
import com.example.ui.components.RealtimeHeader
import com.example.ui.components.TaskCard
import com.example.ui.theme.CleanMinBackground
import com.example.ui.theme.CleanMinBorder
import com.example.ui.theme.CleanMinBorderLight
import com.example.ui.theme.CleanMinDistanceBadge
import com.example.ui.theme.CleanMinOnPackageContainer
import com.example.ui.theme.CleanMinOnPrimaryContainer
import com.example.ui.theme.CleanMinPackageContainer
import com.example.ui.theme.CleanMinPrimary
import com.example.ui.theme.CleanMinPrimaryContainer
import com.example.ui.theme.CleanMinSuccess
import com.example.ui.theme.CleanMinTextPrimary
import com.example.ui.theme.CleanMinTextSecondary
import com.example.ui.theme.CleanMinTextTertiary
import com.example.viewmodel.RiderViewModel
import com.example.viewmodel.TaskFilter
import kotlinx.coroutines.launch

@Composable
fun RiderScreen(
    viewModel: RiderViewModel = viewModel(),
    modifier: Modifier = Modifier
) {
    val connectionState by viewModel.connectionState.collectAsState()
    val allTasks by viewModel.tasks.collectAsState()
    val filteredTasks by viewModel.filteredTasks.collectAsState()
    val selectedFilter by viewModel.selectedFilter.collectAsState()
    val offlineQueueCount by viewModel.offlineQueueCount.collectAsState()
    val activeScanningTask by viewModel.activeScanningTask.collectAsState()
    val scanFeedback by viewModel.scanFeedback.collectAsState()
    val isMapOpen by viewModel.isMapOpen.collectAsState()
    val selectedMapTask by viewModel.selectedMapTask.collectAsState()
    val eventLogs by viewModel.eventLogs.collectAsState()

    val listState = rememberLazyListState()

    Scaffold(
        topBar = {
            RealtimeHeader(
                connectionState = connectionState,
                offlineQueueCount = offlineQueueCount,
                onToggleNetwork = { viewModel.toggleNetwork() },
                onSimulateInbound = { viewModel.simulateInboundTask() },
                onOpenMap = { viewModel.openMap() },
                modifier = Modifier.statusBarsPadding()
            )
        },
        bottomBar = {
            RealtimeEventStream(
                logs = eventLogs,
                modifier = Modifier.navigationBarsPadding()
            )
        },
        containerColor = CleanMinBackground,
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Executive Metrics Overview Strip
            val activeTasksList = allTasks.filter { it.status != TaskStatus.DELIVERED }
            val activeCount = activeTasksList.size
            val completedCount = allTasks.count { it.status == TaskStatus.DELIVERED }
            val totalActiveKm = String.format(java.util.Locale.US, "%.1f", activeTasksList.sumOf { it.distanceKm })
            val totalActiveWeight = String.format(java.util.Locale.US, "%.1f", activeTasksList.sumOf { it.weightKg })

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Metric 1: Active Stops
                Surface(
                    color = Color.White,
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinBorderLight),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp)) {
                        Text(
                            text = "STOPS",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CleanMinTextTertiary,
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "$activeCount active",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CleanMinTextPrimary
                        )
                    }
                }
                // Metric 2: Total Route Distance
                Surface(
                    color = Color.White,
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinBorderLight),
                    modifier = Modifier
                        .weight(1f)
                        .clickable { viewModel.openMap() }
                ) {
                    Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "DISTANCE",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = CleanMinDistanceBadge,
                                letterSpacing = 1.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "$totalActiveKm km",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CleanMinPrimary
                        )
                    }
                }
                // Metric 3: Total Payload Weight
                Surface(
                    color = Color.White,
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinBorderLight),
                    modifier = Modifier.weight(1f)
                ) {
                    Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp)) {
                        Text(
                            text = "PAYLOAD",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CleanMinOnPackageContainer,
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "$totalActiveWeight kg",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CleanMinTextPrimary
                        )
                    }
                }
            }

            // Clean Minimal Filter Tabs
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                TaskFilter.values().forEach { filter ->
                    val isSelected = selectedFilter == filter
                    Surface(
                        shape = RoundedCornerShape(24.dp),
                        color = if (isSelected) CleanMinPrimary else Color.White,
                        modifier = Modifier
                            .clip(RoundedCornerShape(24.dp))
                            .then(
                                if (!isSelected) Modifier.border(1.dp, CleanMinBorderLight, RoundedCornerShape(24.dp))
                                else Modifier
                            )
                            .clickable { viewModel.setFilter(filter) }
                            .testTag("filter_tab_${filter.name.lowercase()}")
                    ) {
                        val count = when (filter) {
                            TaskFilter.ACTIVE -> activeCount
                            TaskFilter.ALL -> allTasks.size
                            TaskFilter.COMPLETED -> completedCount
                        }
                        Text(
                            text = "${filter.label} ($count)",
                            fontSize = 14.sp,
                            fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.SemiBold,
                            color = if (isSelected) Color.White else CleanMinTextSecondary,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                        )
                    }
                }
            }

            // Task List Area
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                if (filteredTasks.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Box(
                                modifier = Modifier
                                    .size(64.dp)
                                    .clip(CircleShape)
                                    .background(Color.White)
                                    .border(1.dp, CleanMinBorderLight, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Inbox,
                                    contentDescription = "No Tasks",
                                    tint = CleanMinTextTertiary,
                                    modifier = Modifier.size(28.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = "No active tasks in this view",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = CleanMinTextSecondary
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        state = listState,
                        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 8.dp, bottom = 28.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp),
                        modifier = Modifier
                            .fillMaxSize()
                            .testTag("tasks_lazy_column")
                    ) {
                        items(filteredTasks, key = { it.id }) { task ->
                            TaskCard(
                                task = task,
                                onAdvanceStatus = { nextStatus ->
                                    viewModel.updateStatus(task.id, nextStatus)
                                },
                                onStartScan = {
                                    viewModel.startQrScan(task)
                                },
                                onSimulateCollision = {
                                    viewModel.simulateCollision(task.id)
                                },
                                onResolveCollision = { claim ->
                                    viewModel.resolveCollision(task.id, claim)
                                },
                                onOpenMap = { selectedTask ->
                                    viewModel.openMap(selectedTask)
                                }
                            )
                        }
                    }
                }
            }
        }

        // Active QR Scanner Modal
        activeScanningTask?.let { task ->
            QrScannerModal(
                task = task,
                onScanned = { code -> viewModel.onQrScanned(code) },
                onDismiss = { viewModel.dismissQrScan() },
                feedback = scanFeedback
            )
        }

        // Interactive Live Route Radar Map Modal
        if (isMapOpen) {
            LiveRouteMapModal(
                tasks = allTasks,
                connectionState = connectionState,
                initialSelectedTask = selectedMapTask,
                onDismiss = { viewModel.closeMap() }
            )
        }
    }
}
