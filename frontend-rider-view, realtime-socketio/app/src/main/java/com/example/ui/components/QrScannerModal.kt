package com.example.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.model.DeliveryTask
import com.example.ui.theme.CleanMinBorder
import com.example.ui.theme.CleanMinPackageContainer
import com.example.ui.theme.CleanMinPrimary
import com.example.ui.theme.CleanMinSuccess
import com.example.ui.theme.CleanMinTextPrimary
import com.example.ui.theme.CleanMinTextSecondary
import com.example.ui.theme.CleanMinTextTertiary

@Composable
fun QrScannerModal(
    task: DeliveryTask,
    onScanned: (String) -> Unit,
    onDismiss: () -> Unit,
    feedback: String? = null
) {
    var flashOn by remember { mutableStateOf(false) }
    val infiniteTransition = rememberInfiniteTransition(label = "scanner")
    val laserY by infiniteTransition.animateFloat(
        initialValue = 0.12f,
        targetValue = 0.88f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "laserPosition"
    )

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(28.dp),
            color = Color.White,
            shadowElevation = 8.dp,
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
                .border(1.dp, CleanMinBorder, RoundedCornerShape(28.dp))
                .testTag("qr_scanner_dialog")
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "VERIFY PACKAGE",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 1.5.sp,
                            color = CleanMinPrimary
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Optical Barcode Scan",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 21.sp,
                            color = CleanMinTextPrimary
                        )
                    }
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFE2E8F0))
                            .testTag("close_qr_dialog_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = CleanMinTextPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Target Package Info Card
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(0xFFF1F5F9))
                        .border(1.dp, CleanMinBorder, RoundedCornerShape(14.dp))
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Inventory2,
                        contentDescription = null,
                        tint = CleanMinPrimary,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = task.item,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CleanMinTextPrimary
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Destination: ${task.customer}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = CleanMinTextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Viewfinder View
                Box(
                    modifier = Modifier
                        .size(220.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (flashOn) Color(0xFF1E293B) else Color(0xFF0F172A))
                        .border(2.dp, CleanMinPrimary.copy(alpha = 0.6f), RoundedCornerShape(20.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    // QR Graphic in background
                    Icon(
                        imageVector = Icons.Default.QrCode,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.15f),
                        modifier = Modifier.size(150.dp)
                    )

                    // Corner guide lines
                    Canvas(modifier = Modifier.matchParentSize()) {
                        val stroke = 3.dp.toPx()
                        val len = 24.dp.toPx()
                        val pad = 16.dp.toPx()
                        val w = size.width
                        val h = size.height
                        val c = CleanMinPrimary

                        // Top-Left
                        drawLine(c, Offset(pad, pad), Offset(pad + len, pad), stroke)
                        drawLine(c, Offset(pad, pad), Offset(pad, pad + len), stroke)
                        // Top-Right
                        drawLine(c, Offset(w - pad, pad), Offset(w - pad - len, pad), stroke)
                        drawLine(c, Offset(w - pad, pad), Offset(w - pad, pad + len), stroke)
                        // Bottom-Left
                        drawLine(c, Offset(pad, h - pad), Offset(pad + len, h - pad), stroke)
                        drawLine(c, Offset(pad, h - pad), Offset(pad, h - pad - len), stroke)
                        // Bottom-Right
                        drawLine(c, Offset(w - pad, h - pad), Offset(w - pad - len, h - pad), stroke)
                        drawLine(c, Offset(w - pad, h - pad), Offset(w - pad, h - pad - len), stroke)

                        // Laser scan sweep
                        val y = h * laserY
                        drawLine(
                            color = CleanMinPrimary,
                            start = Offset(24f, y),
                            end = Offset(w - 24f, y),
                            strokeWidth = 3.dp.toPx()
                        )
                    }

                    // Flashlight toggle inside viewfinder
                    IconButton(
                        onClick = { flashOn = !flashOn },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(8.dp)
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.6f))
                    ) {
                        Icon(
                            imageVector = Icons.Default.FlashOn,
                            contentDescription = "Flashlight",
                            tint = if (flashOn) Color(0xFFFBBF24) else Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }

                    // Target Code Badge
                    Surface(
                        color = Color.Black.copy(alpha = 0.85f),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(bottom = 12.dp)
                    ) {
                        Text(
                            text = task.qrCode,
                            color = Color.White,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }
                }

                if (feedback != null) {
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = feedback,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = CleanMinSuccess
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Scan / Verify Action
                Button(
                    onClick = { onScanned(task.qrCode) },
                    colors = ButtonDefaults.buttonColors(containerColor = CleanMinPrimary),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("verify_qr_scan_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.QrCodeScanner,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Confirm Optical Match", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}


