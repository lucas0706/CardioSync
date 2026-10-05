import { NativeModules } from 'react-native'

import { isValidBackupTime, type BackupSettings } from './BackupSettingsService'

type AlarmSchedulerModule = {
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

export async function openExactAlarmSettings(): Promise<void> {
  await requireModule().openExactAlarmSettings()
}

export async function syncBackupAlarms(settings: BackupSettings): Promise<void> {
  if (!isValidBackupTime(settings.time)) {
    throw new Error('El horario de la copia debe tener formato HH:mm y ser válido.')
  }

  const synchronized = await requireModule().syncAlarms(
    settings.enabled,
    settings.frequency,
    settings.weekday,
    [settings.time],
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
