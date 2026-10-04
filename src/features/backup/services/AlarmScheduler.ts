import { NativeModules } from 'react-native'

type AlarmSchedulerModule = {
  cancelAlarms(): Promise<boolean>

  scheduleDailyAlarm(
    hour: number,
    minute: number,
  ): Promise<boolean>

  scheduleWeeklyAlarm(
    weekday: number,
    hour: number,
    minute: number,
  ): Promise<boolean>
}

const nativeModule =
  NativeModules.AlarmScheduler as
    | AlarmSchedulerModule
    | undefined

function requireModule(): AlarmSchedulerModule {
  if (!nativeModule) {
    throw new Error(
      'AlarmScheduler native module is not available.',
    )
  }

  return nativeModule
}

export async function cancelAlarms(): Promise<void> {
  await requireModule().cancelAlarms()
}

export async function scheduleDailyAlarm(
  hour: number,
  minute: number,
): Promise<void> {
  await requireModule().scheduleDailyAlarm(
    hour,
    minute,
  )
}

export async function scheduleWeeklyAlarm(
  weekday: number,
  hour: number,
  minute: number,
): Promise<void> {
  await requireModule().scheduleWeeklyAlarm(
    weekday,
    hour,
    minute,
  )
}
