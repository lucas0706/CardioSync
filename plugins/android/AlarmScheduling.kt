package com.lucas0706a.CardioSync.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import java.util.Calendar
import org.json.JSONArray

internal data class AlarmConfiguration(
    val enabled: Boolean,
    val frequency: String,
    val weekday: Int,
    val times: List<String>,
)

internal object AlarmScheduling {
    private const val PREFERENCES_NAME = "cardiosync_scheduled_backup"
    private const val KEY_ENABLED = "enabled"
    private const val KEY_FREQUENCY = "frequency"
    private const val KEY_WEEKDAY = "weekday"
    private const val KEY_TIMES = "times"
    private const val FIRST_REQUEST_CODE = 7001
    private const val TEST_REQUEST_CODE = 7099
    private const val ACTION_ALARM_PREFIX =
        "com.lucas0706a.CardioSync.alarm.SCHEDULED_BACKUP."
    private const val ACTION_TEST_ALARM =
        "com.lucas0706a.CardioSync.alarm.HEADLESS_TEST"
    const val EXTRA_SLOT = "cardiosync.alarm.slot"
    const val EXTRA_SCHEDULED_AT = "cardiosync.alarm.scheduledAt"
    const val EXTRA_IS_TEST = "cardiosync.alarm.isTest"
    private const val TEST_DELAY_MILLIS = 30_000L

    fun synchronize(
        context: Context,
        configuration: AlarmConfiguration,
    ): Boolean {
        validate(configuration)
        saveConfiguration(context, configuration)
        cancelAll(context)

        if (!configuration.enabled) {
            return true
        }

        val alarmManager = alarmManager(context)
        checkExactAlarmPermission(alarmManager)

        try {
            configuration.times.indices.forEach { slot ->
                scheduleNext(context, configuration, slot, System.currentTimeMillis())
            }
        } catch (error: Exception) {
            cancelAll(context)
            throw error
        }

        return true
    }

    fun restoreFromPreferences(context: Context): Boolean {
        val configuration = readConfiguration(context) ?: return true
        return synchronize(context, configuration)
    }

    fun scheduleNextForSlot(
        context: Context,
        slot: Int,
        nowMillis: Long = System.currentTimeMillis(),
    ): Boolean {
        val configuration = readConfiguration(context) ?: return false
        if (!configuration.enabled || slot !in configuration.times.indices) {
            return false
        }

        checkExactAlarmPermission(alarmManager(context))
        scheduleNext(context, configuration, slot, nowMillis)
        return true
    }

    fun scheduleTestAlarm(context: Context): Boolean {
        val manager = alarmManager(context)
        cancelTestAlarm(context)
        checkExactAlarmPermission(manager)

        val triggerAtMillis =
            System.currentTimeMillis() + TEST_DELAY_MILLIS
        val pendingIntent =
            createTestPendingIntent(context, triggerAtMillis)

        try {
            manager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerAtMillis,
                pendingIntent,
            )
        } catch (error: Exception) {
            manager.cancel(pendingIntent)
            pendingIntent.cancel()
            throw error
        }

        return true
    }

    fun cancelTestAlarm(context: Context) {
        val pendingIntent =
            createTestPendingIntent(context, null)
        alarmManager(context).cancel(pendingIntent)
        pendingIntent.cancel()
    }

    fun cancelAll(context: Context) {
        val manager = alarmManager(context)
        repeat(3) { slot ->
            val pendingIntent = createPendingIntent(context, slot, null)
            manager.cancel(pendingIntent)
            pendingIntent.cancel()
        }
    }

    fun isExactAlarmAllowed(context: Context): Boolean {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.S ||
            alarmManager(context).canScheduleExactAlarms()
    }

    private fun scheduleNext(
        context: Context,
        configuration: AlarmConfiguration,
        slot: Int,
        nowMillis: Long,
    ) {
        val nextTime = nextOccurrence(
            configuration,
            configuration.times[slot],
            nowMillis,
        )

        alarmManager(context).setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            nextTime,
            createPendingIntent(context, slot, nextTime),
        )
    }

    private fun nextOccurrence(
        configuration: AlarmConfiguration,
        time: String,
        nowMillis: Long,
    ): Long {
        val parts = time.split(":")
        val hour = parts[0].toInt()
        val minute = parts[1].toInt()
        val calendar = Calendar.getInstance().apply {
            timeInMillis = nowMillis
        }

        if (configuration.frequency == "weekly") {
            val targetAndroidWeekday =
                configuration.weekday + Calendar.SUNDAY
            val currentAndroidWeekday =
                calendar.get(Calendar.DAY_OF_WEEK)
            val daysUntilTarget =
                (targetAndroidWeekday - currentAndroidWeekday + 7) % 7
            calendar.add(Calendar.DAY_OF_YEAR, daysUntilTarget)
        }

        calendar.set(Calendar.HOUR_OF_DAY, hour)
        calendar.set(Calendar.MINUTE, minute)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)

        if (calendar.timeInMillis <= nowMillis) {
            calendar.add(
                if (configuration.frequency == "weekly") {
                    Calendar.WEEK_OF_YEAR
                } else {
                    Calendar.DAY_OF_YEAR
                },
                1,
            )
        }

        return calendar.timeInMillis
    }

    private fun createPendingIntent(
        context: Context,
        slot: Int,
        scheduledAt: Long?,
    ): PendingIntent {
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            action = "$ACTION_ALARM_PREFIX$slot"
            putExtra(EXTRA_SLOT, slot)
            if (scheduledAt != null) {
                putExtra(EXTRA_SCHEDULED_AT, scheduledAt)
            }
        }

        return PendingIntent.getBroadcast(
            context,
            FIRST_REQUEST_CODE + slot,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }

    private fun createTestPendingIntent(
        context: Context,
        scheduledAt: Long?,
    ): PendingIntent {
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            action = ACTION_TEST_ALARM
            putExtra(EXTRA_IS_TEST, true)
            if (scheduledAt != null) {
                putExtra(EXTRA_SCHEDULED_AT, scheduledAt)
            }
        }

        return PendingIntent.getBroadcast(
            context,
            TEST_REQUEST_CODE,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }

    private fun saveConfiguration(
        context: Context,
        configuration: AlarmConfiguration,
    ) {
        val saved = context.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE)
            .edit()
            .putBoolean(KEY_ENABLED, configuration.enabled)
            .putString(KEY_FREQUENCY, configuration.frequency)
            .putInt(KEY_WEEKDAY, configuration.weekday)
            .putString(KEY_TIMES, JSONArray(configuration.times).toString())
            .commit()
        check(saved) {
            "Could not persist the scheduled backup configuration."
        }
    }

    private fun readConfiguration(context: Context): AlarmConfiguration? {
        val preferences = context.getSharedPreferences(
            PREFERENCES_NAME,
            Context.MODE_PRIVATE,
        )
        if (!preferences.contains(KEY_ENABLED)) {
            return null
        }

        val storedTimes = preferences.getString(KEY_TIMES, "[]") ?: "[]"
        val timesJson = JSONArray(storedTimes)
        val times = (0 until timesJson.length()).map { index ->
            timesJson.getString(index)
        }

        return AlarmConfiguration(
            enabled = preferences.getBoolean(KEY_ENABLED, false),
            frequency = preferences.getString(KEY_FREQUENCY, "daily") ?: "daily",
            weekday = preferences.getInt(KEY_WEEKDAY, 1),
            times = times,
        )
    }

    private fun validate(configuration: AlarmConfiguration) {
        require(
            configuration.frequency == "daily" ||
                configuration.frequency == "weekly",
        ) {
            "Backup frequency must be daily or weekly."
        }
        require(configuration.weekday in 0..6) {
            "Backup weekday must use CardioSync's Sunday=0 through Saturday=6 numbering."
        }
        require(configuration.times.size <= 3) {
            "No more than three backup times can be scheduled."
        }
        require(configuration.times.distinct().size == configuration.times.size) {
            "Backup times must be unique."
        }
        require(configuration.times.all { it.matches(Regex("""\d{2}:\d{2}""")) }) {
            "Backup times must use HH:mm format."
        }
        require(configuration.times.all { time ->
            val parts = time.split(":")
            parts[0].toInt() in 0..23 && parts[1].toInt() in 0..59
        }) {
            "Backup times must contain a valid hour and minute."
        }
    }

    private fun checkExactAlarmPermission(manager: AlarmManager) {
        if (!isExactAlarmAllowedFor(manager)) {
            throw SecurityException(
                "Android exact-alarm permission is not granted for CardioSync.",
            )
        }
    }

    private fun isExactAlarmAllowedFor(manager: AlarmManager): Boolean {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.S ||
            manager.canScheduleExactAlarms()
    }

    private fun alarmManager(context: Context): AlarmManager {
        return context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    }
}
