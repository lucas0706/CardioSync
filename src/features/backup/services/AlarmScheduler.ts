import { NativeModules } from 'react-native'

import type { BackupSettings } from './BackupSettingsService'

type AlarmSchedulerModule = {
  scheduleTestAlarm(): Promise<boolean>
  syncAlarms(
    enabled: boolean,
    frequency: BackupSettings['frequency'],
    weekday: number,
    times: string[],
  ): Promise<boolean>
  canScheduleExactAlarms(): Promise<boolean>
  openExactAlarmSettings(): Promise<boolean>
}

type NativeModuleError = {
  code?: string
  message?: string
}

const nativeModule = NativeModules.AlarmScheduler as AlarmSchedulerModule | undefined

function requireModule(): AlarmSchedulerModule {
  if (!nativeModule) {
    throw new Error(
      'AlarmScheduler native module is not available. Rebuild the Android development client after prebuild.',
    )
  }

  return nativeModule
}

export async function canScheduleExactAlarms(): Promise<boolean> {
  return requireModule().canScheduleExactAlarms()
}

export async function scheduleHeadlessTestAlarm(): Promise<void> {
  const scheduled = await requireModule().scheduleTestAlarm()

  if (!scheduled) {
    throw new Error(
      'Android did not confirm that the one-shot Headless JS test alarm was scheduled.',
    )
  }
}

export async function openExactAlarmSettings(): Promise<void> {
  await requireModule().openExactAlarmSettings()
}

export async function syncBackupAlarms(settings: BackupSettings): Promise<void> {
  const synchronized = await requireModule().syncAlarms(
    settings.enabled,
    settings.frequency,
    settings.weekday,
    settings.times,
  )

  if (!synchronized) {
    throw new Error('Android did not confirm that the scheduled backup alarms were installed.')
  }
}

export function isExactAlarmPermissionError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  const nativeError = error as NativeModuleError

  return (
    nativeError.code === 'E_EXACT_ALARM_PERMISSION' ||
    nativeError.message?.includes('exact-alarm permission') === true
  )
}
