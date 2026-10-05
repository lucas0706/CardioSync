package com.lucas0706a.CardioSync.alarm

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

class AlarmSchedulerModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AlarmScheduler"

    @ReactMethod
    fun syncAlarms(
        enabled: Boolean,
        frequency: String,
        weekday: Int,
        times: ReadableArray,
        promise: Promise,
    ) {
        try {
            val parsedTimes = (0 until times.size()).map { index ->
                times.getString(index)
                    ?: throw IllegalArgumentException(
                        "Backup time at index $index must be a string.",
                    )
            }
            val configuration = AlarmConfiguration(
                enabled = enabled,
                frequency = frequency,
                weekday = weekday,
                times = parsedTimes,
            )
            promise.resolve(
                AlarmScheduling.synchronize(
                    reactApplicationContext,
                    configuration,
                ),
            )
        } catch (error: SecurityException) {
            promise.reject(
                "E_EXACT_ALARM_PERMISSION",
                error.message
                    ?: "Android exact-alarm permission is not granted for CardioSync.",
                error,
            )
        } catch (error: IllegalArgumentException) {
            promise.reject("E_INVALID_ALARM_CONFIGURATION", error.message, error)
        } catch (error: Exception) {
            promise.reject("E_ALARM_SCHEDULING", error.message, error)
        }
    }

    @ReactMethod
    fun scheduleTestAlarm(promise: Promise) {
        try {
            promise.resolve(
                AlarmScheduling.scheduleTestAlarm(reactApplicationContext),
            )
        } catch (error: SecurityException) {
            promise.reject(
                "E_EXACT_ALARM_PERMISSION",
                error.message
                    ?: "Android exact-alarm permission is not granted for CardioSync.",
                error,
            )
        } catch (error: Exception) {
            promise.reject("E_TEST_ALARM_SCHEDULING", error.message, error)
        }
    }

    @ReactMethod
    fun canScheduleExactAlarms(promise: Promise) {
        try {
            promise.resolve(
                AlarmScheduling.isExactAlarmAllowed(
                    reactApplicationContext,
                ),
            )
        } catch (error: Exception) {
            promise.reject("E_EXACT_ALARM_CHECK", error.message, error)
        }
    }

    @ReactMethod
    fun openExactAlarmSettings(promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            promise.resolve(true)
            return
        }

        try {
            val intent = Intent(
                Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,
                Uri.parse("package:${reactApplicationContext.packageName}"),
            ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (error: ActivityNotFoundException) {
            promise.reject(
                "E_EXACT_ALARM_SETTINGS",
                "Android could not open the exact-alarm permission settings.",
                error,
            )
        } catch (error: Exception) {
            promise.reject("E_EXACT_ALARM_SETTINGS", error.message, error)
        }
    }
}
