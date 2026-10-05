package com.lucas0706a.CardioSync.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val slot = intent.getIntExtra(AlarmScheduling.EXTRA_SLOT, -1)
        val scheduledAt = intent.getLongExtra(
            AlarmScheduling.EXTRA_SCHEDULED_AT,
            0L,
        )

        if (scheduledAt <= 0L || slot !in 0..2) {
            Log.e(TAG, "Received a backup alarm with invalid scheduling data.")
            return
        }

        try {
            AlarmScheduling.scheduleNextForSlot(context, slot)
        } catch (error: Exception) {
            Log.e(TAG, "Could not schedule the next backup alarm.", error)
        }

        val serviceIntent = Intent(context, AlarmBackupTaskService::class.java).apply {
            putExtra("scheduledAt", scheduledAt)
            putExtra("slot", slot)
        }

        try {
            if (context.startService(serviceIntent) == null) {
                Log.e(TAG, "Android did not start the Headless JS backup service.")
                return
            }
            HeadlessJsTaskService.acquireWakeLockNow(context)
        } catch (error: RuntimeException) {
            Log.e(TAG, "Could not start the Headless JS backup service.", error)
        }
    }

    private companion object {
        const val TAG = "CardioSyncAlarm"
    }
}
