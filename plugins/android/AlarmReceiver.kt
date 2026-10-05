package com.lucas0706a.CardioSync.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val isTest =
            intent.getBooleanExtra(AlarmScheduling.EXTRA_IS_TEST, false)
        val slot = intent.getIntExtra(AlarmScheduling.EXTRA_SLOT, -1)
        val scheduledAt = intent.getLongExtra(
            AlarmScheduling.EXTRA_SCHEDULED_AT,
            0L,
        )

        if (
            scheduledAt <= 0L ||
            (!isTest && slot !in 0..2)
        ) {
            Log.e(TAG, "Received a backup alarm with invalid scheduling data.")
            return
        }

        if (isTest) {
            try {
                AlarmScheduling.cancelTestAlarm(context)
            } catch (error: Exception) {
                Log.e(TAG, "Could not cancel the one-shot test alarm.", error)
            }
        } else {
            try {
                AlarmScheduling.scheduleNextForSlot(context, slot)
            } catch (error: Exception) {
                Log.e(TAG, "Could not schedule the next backup alarm.", error)
            }
        }

        val serviceIntent = Intent(context, AlarmBackupTaskService::class.java).apply {
            putExtra("scheduledAt", scheduledAt)
            putExtra("slot", slot)
            putExtra(AlarmScheduling.EXTRA_IS_TEST, isTest)
        }

        try {
            if (context.startService(serviceIntent) == null) {
                Log.e(TAG, "Android did not start the Headless JS backup service.")
                if (isTest) {
                    showTestFailureNotification(
                        context,
                        "Android no pudo iniciar AlarmBackupTaskService.",
                    )
                }
                return
            }
            HeadlessJsTaskService.acquireWakeLockNow(context)
        } catch (error: RuntimeException) {
            Log.e(TAG, "Could not start the Headless JS backup service.", error)
            if (isTest) {
                showTestFailureNotification(
                    context,
                    "No se pudo iniciar el servicio Headless JS: ${error.message ?: "error de Android"}.",
                )
            }
        }
    }

    private fun showTestFailureNotification(
        context: Context,
        message: String,
    ) {
        try {
            val manager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as
                    android.app.NotificationManager
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                manager.createNotificationChannel(
                    android.app.NotificationChannel(
                        TEST_CHANNEL_ID,
                        "Pruebas de AlarmManager",
                        android.app.NotificationManager.IMPORTANCE_DEFAULT,
                    ),
                )
            }
            val notification =
                android.app.Notification.Builder(context, TEST_CHANNEL_ID)
                    .setSmallIcon(android.R.drawable.stat_notify_error)
                    .setContentTitle("Prueba Headless JS: error")
                    .setContentText(message)
                    .setAutoCancel(true)
                    .build()
            manager.notify(TEST_NOTIFICATION_ID, notification)
        } catch (error: Exception) {
            Log.e(TAG, "Could not show the Headless JS test failure notification.", error)
        }
    }

    private companion object {
        const val TAG = "CardioSyncAlarm"
        const val TEST_CHANNEL_ID = "cardiosync-headless-test"
        const val TEST_NOTIFICATION_ID = 7099
    }
}
