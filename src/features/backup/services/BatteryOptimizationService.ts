import { Platform } from 'react-native'

import * as IntentLauncher from 'expo-intent-launcher'

export async function openBatteryOptimizationSettings(): Promise<void> {
  if (Platform.OS !== 'android') {
    return
  }

  await IntentLauncher.startActivityAsync(
    'android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS',
  )
}
