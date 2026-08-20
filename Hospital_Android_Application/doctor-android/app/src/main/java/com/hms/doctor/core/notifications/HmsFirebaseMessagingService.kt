package com.hms.doctor.core.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.hms.doctor.MainActivity
import com.hms.doctor.domain.repository.NotificationRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

import com.hms.doctor.core.auth.SessionManager

@AndroidEntryPoint
class HmsFirebaseMessagingService : FirebaseMessagingService() {

    @Inject
    lateinit var notificationRepository: NotificationRepository

    @Inject
    lateinit var sessionManager: SessionManager

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Auto-register FCM token with Laravel backend for authenticated physician
        val doctorId = sessionManager.getDoctorId()
        if (doctorId > 0) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    notificationRepository.registerFcmToken(doctorId, token)
                } catch (_: Exception) {}
            }
        }
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val title = remoteMessage.notification?.title ?: remoteMessage.data["title"] ?: "HMS Doctor Alert"
        val body = remoteMessage.notification?.body ?: remoteMessage.data["message"] ?: "New clinical update received."

        showNotification(title, body)
    }

    private fun showNotification(title: String, message: String) {
        val channelId = "hms_clinical_alerts_channel"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Clinical & OPD Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High priority hospital alerts, patient queue, and lab reports"
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
