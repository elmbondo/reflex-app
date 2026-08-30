package com.example.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Directions
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.NearMe
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.TwoWheeler
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.model.ConnectionState
import com.example.model.DeliveryTask
import com.example.model.TaskStatus
import com.example.ui.theme.CleanMinBorder
import com.example.ui.theme.CleanMinMapBackground
import com.example.ui.theme.CleanMinMapPolyline
import com.example.ui.theme.CleanMinMapRiderPulse
import com.example.ui.theme.CleanMinMapRoad
import com.example.ui.theme.CleanMinPrimary
import com.example.ui.theme.CleanMinPrimaryContainer
import com.example.ui.theme.CleanMinSuccess
import com.example.ui.theme.CleanMinTextPrimary
import com.example.ui.theme.CleanMinTextSecondary
import com.example.ui.theme.CleanMinTextTertiary
import com.example.ui.theme.CleanMinWarning

@Composable
fun LiveRouteMapModal(
    tasks: List<DeliveryTask>,
    connectionState: ConnectionState,
    initialSelectedTask: DeliveryTask? = null,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    val activeTasks = remember(tasks) {
        tasks.filter { it.status != TaskStatus.DELIVERED }.ifEmpty { tasks }
    }

    var selectedTask by remember(initialSelectedTask, activeTasks) {
        mutableStateOf(initialSelectedTask ?: activeTasks.firstOrNull() ?: tasks.first())
    }

    var simulatedProgress by remember { mutableFloatStateOf(0.15f) }

    val infiniteTransition = rememberInfiniteTransition(label = "RadarPulse")
    val pulseRadius by infiniteTransition.animateFloat(
        initialValue = 18f,
        targetValue = 48f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "PulseRadius"
    )
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "PulseAlpha"
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(Color(0xFF090D16).copy(alpha = 0.95f))
                .padding(horizontal = 14.dp, vertical = 20.dp),
            contentAlignment = Alignment.Center
        ) {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155)),
                elevation = CardDefaults.cardElevation(defaultElevation = 16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxSize()
                    .testTag("live_route_map_dialog")
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    // Top Bar: Live telemetry & close
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(CleanMinPrimary.copy(alpha = 0.2f))
                                    .border(1.dp, CleanMinPrimary.copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Navigation,
                                    contentDescription = "Radar",
                                    tint = CleanMinMapPolyline,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "LIVE DISPATCH RADAR",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    letterSpacing = 1.sp,
                                    color = CleanMinMapPolyline
                                )
                                Text(
                                    text = "Rider-to-Destination Route",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                            }
                        }

                        IconButton(
                            onClick = onDismiss,
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF1E293B))
                                .testTag("close_map_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Close",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Selected Destination Info Banner
                    Surface(
                        color = Color(0xFF1E293B),
                        shape = RoundedCornerShape(16.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Surface(
                                        color = CleanMinPrimary,
                                        shape = RoundedCornerShape(6.dp)
                                    ) {
                                        Text(
                                            text = selectedTask.code,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = Color.White,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = selectedTask.customer,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                                Spacer(modifier = Modifier.height(3.dp))
                                Text(
                                    text = selectedTask.address,
                                    fontSize = 13.sp,
                                    color = Color(0xFF94A3B8),
                                    maxLines = 1
                                )
                            }

                            // Dynamic Distance Badge
                            Column(horizontalAlignment = Alignment.End) {
                                Surface(
                                    color = Color(0xFF0369A1),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.NearMe,
                                            contentDescription = null,
                                            tint = Color.White,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = "${selectedTask.distanceKm} km",
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = Color.White
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(3.dp))
                                Text(
                                    text = "ETA ~${selectedTask.etaMinutes} min • ${selectedTask.weightKg} kg",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFF38BDF8)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Vector Route & City Grid Map Canvas
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(CleanMinMapBackground)
                            .border(1.dp, Color(0xFF334155), RoundedCornerShape(20.dp))
                    ) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            val w = size.width
                            val h = size.height

                            // 1. Draw city street grid
                            val gridSpacing = 44.dp.toPx()
                            val roadPaint = CleanMinMapRoad
                            for (x in 0..(w / gridSpacing).toInt() + 1) {
                                val xPos = x * gridSpacing
                                drawLine(
                                    color = roadPaint,
                                    start = Offset(xPos, 0f),
                                    end = Offset(xPos, h),
                                    strokeWidth = 3.dp.toPx()
                                )
                            }
                            for (y in 0..(h / gridSpacing).toInt() + 1) {
                                val yPos = y * gridSpacing
                                drawLine(
                                    color = roadPaint,
                                    start = Offset(0f, yPos),
                                    end = Offset(w, yPos),
                                    strokeWidth = 3.dp.toPx()
                                )
                            }

                            // 2. Draw arterial avenue
                            drawLine(
                                color = Color(0xFF334155),
                                start = Offset(0f, h * 0.45f),
                                end = Offset(w, h * 0.45f),
                                strokeWidth = 8.dp.toPx()
                            )
                            drawLine(
                                color = Color(0xFF334155),
                                start = Offset(w * 0.52f, 0f),
                                end = Offset(w * 0.52f, h),
                                strokeWidth = 8.dp.toPx()
                            )

                            // 3. Define Rider Origin & Delivery Target
                            val riderPos = Offset(w * 0.22f, h * 0.76f)
                            val targetPos = Offset(w * 0.78f, h * 0.24f)
                            val midPoint1 = Offset(w * 0.52f, h * 0.76f)
                            val midPoint2 = Offset(w * 0.52f, h * 0.24f)

                            // 4. Draw Route Path Line (Polyline with glow)
                            val routePath = Path().apply {
                                moveTo(riderPos.x, riderPos.y)
                                lineTo(midPoint1.x, midPoint1.y)
                                lineTo(midPoint2.x, midPoint2.y)
                                lineTo(targetPos.x, targetPos.y)
                            }

                            // Glow underlayer
                            drawPath(
                                path = routePath,
                                color = CleanMinMapPolyline.copy(alpha = 0.25f),
                                style = Stroke(width = 12.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
                            )
                            // Core polyline
                            drawPath(
                                path = routePath,
                                color = CleanMinMapPolyline,
                                style = Stroke(
                                    width = 4.5.dp.toPx(),
                                    cap = StrokeCap.Round,
                                    join = StrokeJoin.Round,
                                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(24f, 12f), 0f)
                                )
                            )

                            // 5. Draw Pulse wave around Rider
                            drawCircle(
                                color = CleanMinMapRiderPulse.copy(alpha = pulseAlpha),
                                radius = pulseRadius * 1.6f,
                                center = riderPos
                            )

                            // 6. Draw Rider Marker (Blue Circle + White Core)
                            drawCircle(
                                color = CleanMinPrimary,
                                radius = 16.dp.toPx(),
                                center = riderPos
                            )
                            drawCircle(
                                color = Color.White,
                                radius = 7.dp.toPx(),
                                center = riderPos
                            )

                            // 7. Draw Destination Pin (Emerald / Crimson Target)
                            drawCircle(
                                color = CleanMinSuccess.copy(alpha = 0.3f),
                                radius = 22.dp.toPx(),
                                center = targetPos
                            )
                            drawCircle(
                                color = CleanMinSuccess,
                                radius = 14.dp.toPx(),
                                center = targetPos
                            )
                            drawCircle(
                                color = Color.White,
                                radius = 5.dp.toPx(),
                                center = targetPos
                            )

                            // 8. Draw other secondary active stop pins on map
                            val otherStops = listOf(
                                Offset(w * 0.35f, h * 0.30f),
                                Offset(w * 0.85f, h * 0.65f)
                            )
                            otherStops.forEach { stopOffset ->
                                drawCircle(
                                    color = Color(0xFF64748B),
                                    radius = 8.dp.toPx(),
                                    center = stopOffset
                                )
                                drawCircle(
                                    color = Color.White,
                                    radius = 3.dp.toPx(),
                                    center = stopOffset
                                )
                            }
                        }

                        // Floating Rider Telemetry Pill on Map
                        Surface(
                            color = Color(0xFF0F172A).copy(alpha = 0.9f),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinPrimary.copy(alpha = 0.6f)),
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(12.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .clip(CircleShape)
                                        .background(CleanMinSuccess)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "RIDER RD-05 • 36 km/h",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                            }
                        }

                        // Floating Target Distance Pill on Map
                        Surface(
                            color = Color(0xFF0F172A).copy(alpha = 0.9f),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinSuccess.copy(alpha = 0.6f)),
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(12.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = CleanMinSuccess,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "DROP-OFF: ${selectedTask.distanceKm} km",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Turn-by-Turn Guidance Pill
                    Surface(
                        color = Color(0xFF1E293B),
                        shape = RoundedCornerShape(14.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Directions,
                                contentDescription = "Turn",
                                tint = Color(0xFF38BDF8),
                                modifier = Modifier.size(22.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "In 250m: Turn right onto Kingsway Ave",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Text(
                                    text = "Shortest route avoiding traffic • RTK accuracy 2.1m",
                                    fontSize = 11.sp,
                                    color = Color(0xFF94A3B8)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Delivery Stops Switcher Row (Tap stop to view distance)
                    Text(
                        text = "SELECT ACTIVE STOP TO INSPECT DISTANCE:",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.5.sp,
                        color = Color(0xFF94A3B8)
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        activeTasks.forEach { task ->
                            val isSelected = task.id == selectedTask.id
                            Surface(
                                color = if (isSelected) CleanMinPrimary else Color(0xFF1E293B),
                                shape = RoundedCornerShape(12.dp),
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) CleanMinMapPolyline else Color(0xFF334155)
                                ),
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .clickable { selectedTask = task }
                                    .testTag("map_stop_tab_${task.id}")
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                                ) {
                                    Text(
                                        text = task.code,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = Color.White
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "${task.distanceKm} km",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isSelected) Color.White else Color(0xFF38BDF8)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "• ${task.weightKg} kg",
                                        fontSize = 11.sp,
                                        color = if (isSelected) Color.White.copy(alpha = 0.8f) else Color(0xFF94A3B8)
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Bottom Action Button: Close Map / Confirm Routing
                    Button(
                        onClick = onDismiss,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = CleanMinPrimary,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(24.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .testTag("close_radar_map_bottom_button")
                    ) {
                        Text(
                            text = "Return to Tasks & Route Queue",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
