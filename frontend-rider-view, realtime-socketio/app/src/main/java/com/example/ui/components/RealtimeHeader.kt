package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.NearMe
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.model.ConnectionState
import com.example.ui.theme.CleanMinBorder
import com.example.ui.theme.CleanMinBorderLight
import com.example.ui.theme.CleanMinDistanceBadge
import com.example.ui.theme.CleanMinDistanceContainer
import com.example.ui.theme.CleanMinError
import com.example.ui.theme.CleanMinErrorContainer
import com.example.ui.theme.CleanMinOnPrimaryContainer
import com.example.ui.theme.CleanMinPrimary
import com.example.ui.theme.CleanMinPrimaryContainer
import com.example.ui.theme.CleanMinTextPrimary
import com.example.ui.theme.CleanMinTextSecondary
import com.example.ui.theme.CleanMinTextTertiary
import com.example.ui.theme.CleanMinWarning
import com.example.ui.theme.CleanMinWarningContainer

@Composable
fun RealtimeHeader(
    connectionState: ConnectionState,
    offlineQueueCount: Int,
    onToggleNetwork: () -> Unit,
    onSimulateInbound: () -> Unit,
    onOpenMap: () -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.35f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(900),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseAlpha"
    )

    val chipBgColor by animateColorAsState(
        targetValue = when (connectionState) {
            ConnectionState.CONNECTED -> CleanMinPrimaryContainer
            ConnectionState.SYNCING -> CleanMinWarningContainer
            ConnectionState.OFFLINE -> CleanMinErrorContainer
        },
        label = "chipBgColor"
    )

    val chipTextColor by animateColorAsState(
        targetValue = when (connectionState) {
            ConnectionState.CONNECTED -> CleanMinPrimary
            ConnectionState.SYNCING -> CleanMinWarning
            ConnectionState.OFFLINE -> CleanMinError
        },
        label = "chipTextColor"
    )

    val dotColor by animateColorAsState(
        targetValue = when (connectionState) {
            ConnectionState.CONNECTED -> CleanMinPrimary
            ConnectionState.SYNCING -> CleanMinWarning
            ConnectionState.OFFLINE -> CleanMinError
        },
        label = "dotColor"
    )

    Surface(
        color = Color.White,
        modifier = modifier
            .fillMaxWidth()
            .border(1.dp, CleanMinBorderLight)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Brand and Role
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Motorcycle rider icon badge
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(CleanMinPrimaryContainer)
                            .border(1.5.dp, CleanMinPrimary.copy(alpha = 0.3f), RoundedCornerShape(14.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.ic_motorcycle_rider),
                            contentDescription = "Motorcycle Rider",
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(14.dp)),
                            contentScale = ContentScale.Crop
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Reflex",
                                fontSize = 22.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = 0.5.sp,
                                color = CleanMinTextPrimary
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(CleanMinDistanceContainer)
                                    .border(1.dp, CleanMinDistanceBadge.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "RD-05",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = CleanMinDistanceBadge
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Realtime Delivery Engine",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = CleanMinPrimary
                        )
                    }
                }

                // Controls: Map Radar, Inbound Push, and Live Network Sync Chip
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Quick Navigation / Map Radar Button
                    IconButton(
                        onClick = onOpenMap,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(CleanMinPrimaryContainer)
                            .border(1.dp, CleanMinPrimary.copy(alpha = 0.4f), CircleShape)
                            .testTag("open_radar_map_header_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Navigation,
                            contentDescription = "Live Radar Map",
                            tint = CleanMinPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    // Quick add simulated task
                    IconButton(
                        onClick = onSimulateInbound,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFF1F5F9))
                            .border(1.dp, CleanMinBorderLight, CircleShape)
                            .testTag("inbound_task_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "New Task",
                            tint = CleanMinTextPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    // Clean Minimal Live Chip (Click opens Map displaying distance & live route)
                    Surface(
                        shape = RoundedCornerShape(24.dp),
                        color = chipBgColor,
                        border = androidx.compose.foundation.BorderStroke(1.dp, dotColor.copy(alpha = 0.3f)),
                        modifier = Modifier
                            .clip(RoundedCornerShape(24.dp))
                            .clickable(onClick = onOpenMap)
                            .testTag("realtime_sync_live_chip")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .alpha(if (connectionState == ConnectionState.CONNECTED) pulseAlpha else 1f)
                                    .clip(CircleShape)
                                    .background(dotColor)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = when (connectionState) {
                                    ConnectionState.CONNECTED -> "LIVE (14ms)"
                                    ConnectionState.SYNCING -> "SYNCING"
                                    ConnectionState.OFFLINE -> "OFFLINE"
                                },
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = chipTextColor,
                                letterSpacing = 0.5.sp
                            )
                            Spacer(modifier = Modifier.width(5.dp))
                            IconButton(
                                onClick = onToggleNetwork,
                                modifier = Modifier
                                    .size(20.dp)
                                    .testTag("network_toggle_button")
                            ) {
                                Icon(
                                    imageVector = if (connectionState == ConnectionState.OFFLINE)
                                        Icons.Default.WifiOff else Icons.Default.Wifi,
                                    contentDescription = "Toggle Network",
                                    tint = chipTextColor,
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Offline queue banner if pending
            AnimatedVisibility(visible = offlineQueueCount > 0) {
                Surface(
                    color = CleanMinWarningContainer,
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, CleanMinWarning.copy(alpha = 0.2f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Sync,
                            contentDescription = "Queue",
                            tint = CleanMinWarning,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "$offlineQueueCount queued offline (auto-sync on reconnect)",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = CleanMinWarning
                        )
                    }
                }
            }
        }
    }
}
