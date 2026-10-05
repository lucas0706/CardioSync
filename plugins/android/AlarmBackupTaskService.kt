package com.lucas0706a.CardioSync.alarm

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class AlarmBackupTaskService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        val scheduledAt = intent?.getLongExtra("scheduledAt", 0L) ?: 0L
        if (scheduledAt <= 0L) {
            return null
        }
        val data = Arguments.createMap().apply {
            putDouble("scheduledAt", scheduledAt.toDouble())
            putInt("slot", intent?.getIntExtra("slot", -1) ?: -1)
        }

        return HeadlessJsTaskConfig(
            TASK_KEY,
            data,
            BACKUP_TIMEOUT_MILLIS,
            false,
        )
    }

    private companion object {
        const val TASK_KEY = "CardioSyncScheduledBackup"
        const val BACKUP_TIMEOUT_MILLIS = 15 * 60 * 1000L
    }
}
