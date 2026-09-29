import { Platform } from 'react-native'

import * as Notifications from 'expo-notifications'

const BACKUP_NOTIFICATION_CHANNEL_ID =
  'cardiosync-backups'

let initialized = false

export async function initializeBackupNotifications(): Promise<void> {
  if (initialized) {
    return
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(
      BACKUP_NOTIFICATION_CHANNEL_ID,
      {
        name: 'Copias de seguridad',
        importance:
          Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [
          0,
          250,
          250,
          250,
        ],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      },
    )
  }

  initialized = true
}

export async function requestBackupNotificationPermission(): Promise<boolean> {
  await initializeBackupNotifications()

  const current =
    await Notifications.getPermissionsAsync()

  if (current.granted) {
    return true
  }

  const requested =
    await Notifications.requestPermissionsAsync()

  return requested.granted
}

async function canShowBackupNotification(): Promise<boolean> {
  await initializeBackupNotifications()

  const permissions =
    await Notifications.getPermissionsAsync()

  return permissions.granted
}

export async function showBackupSuccessNotification(
  measurementCount: number,
): Promise<void> {
  const allowed =
    await canShowBackupNotification()

  if (!allowed) {
    return
  }

  const body =
    measurementCount === 1
      ? 'La copia de CardioSync se guardó correctamente en Google Drive. 1 medición respaldada.'
      : `La copia de CardioSync se guardó correctamente en Google Drive. ${measurementCount} mediciones respaldadas.`

  await Notifications.scheduleNotificationAsync({
    content: {
      title:
        'Copia de seguridad realizada',
      body,
      data: {
        type: 'cardiosync-backup',
        status: 'success',
      },
    },
    trigger: null,
  })
}

export async function showBackupErrorNotification(
  error: string,
): Promise<void> {
  const allowed =
    await canShowBackupNotification()

  if (!allowed) {
    return
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title:
        'Error en la copia de seguridad',
      body:
        error ||
        'No se pudo completar la copia de CardioSync en Google Drive.',
      data: {
        type: 'cardiosync-backup',
        status: 'error',
      },
    },
    trigger: null,
  })
}
