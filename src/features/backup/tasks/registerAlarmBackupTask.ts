import { AppRegistry } from 'react-native'

export const CARDIOSYNC_HEADLESS_BACKUP_TASK = 'CardioSyncScheduledBackup'

type AlarmTaskData = {
  scheduledAt?: unknown
  isTest?: unknown
}

function getScheduledAtTimestamp(taskData: AlarmTaskData): number | undefined {
  return typeof taskData.scheduledAt === 'number' && Number.isFinite(taskData.scheduledAt)
    ? taskData.scheduledAt
    : undefined
}

AppRegistry.registerHeadlessTask(
  CARDIOSYNC_HEADLESS_BACKUP_TASK,
  () => async (taskData: AlarmTaskData) => {
    if (taskData.isTest === true) {
      try {
        const notifications = await import('@/features/backup/services/BackupNotificationService')
        await notifications.showHeadlessAlarmTestSuccessNotification()
      } catch (error) {
        console.error('AlarmManager + Headless JS test notification failed.', error)

        try {
          const notifications = await import('@/features/backup/services/BackupNotificationService')
          await notifications.showHeadlessAlarmTestErrorNotification(
            error instanceof Error ? error.message : 'Error desconocido en la prueba Headless.',
          )
        } catch (notificationError) {
          console.error(
            'Could not show the Headless JS test error notification.',
            notificationError,
          )
        }
      }

      return
    }

    try {
      const [{ initializeDatabase }, { runHeadlessScheduledBackup }] = await Promise.all([
        import('@/core/database/init'),
        import('@/features/backup/services/ScheduledBackupService'),
      ])

      initializeDatabase()

      await runHeadlessScheduledBackup(getScheduledAtTimestamp(taskData))
    } catch (error) {
      console.error('Headless scheduled backup task failed.', error)
    }
  },
)
