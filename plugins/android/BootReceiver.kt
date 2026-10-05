package com.lucas0706a.CardioSync.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) {
            return
        }

        try {
            AlarmScheduling.restoreFromPreferences(context)
        } catch (error: Exception) {
            Log.e(
                "CardioSyncAlarm",
                "Could not restore scheduled backups after reboot.",
                error,
            )
        }
    }
}
