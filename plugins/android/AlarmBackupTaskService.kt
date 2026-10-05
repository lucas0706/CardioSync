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
        val isTest =
            intent?.getBooleanExtra(AlarmScheduling.EXTRA_IS_TEST, false) ?: false

        val data = Arguments.createMap().apply {
            putDouble("scheduledAt", scheduledAt.toDouble())
            putInt("slot", intent?.getIntExtra("slot", -1) ?: -1)
            putBoolean("isTest", isTest)
        }

        return HeadlessJsTaskConfig(
            TASK_KEY,
            data,
            if (isTest) TEST_TIMEOUT_MILLIS else BACKUP_TIMEOUT_MILLIS,
            isTest,
        )
    }

    private companion object {
        const val TASK_KEY = "CardioSyncScheduledBackup"
        const val TEST_TIMEOUT_MILLIS = 60_000L
        const val BACKUP_TIMEOUT_MILLIS = 15 * 60 * 1000L
    }
}
