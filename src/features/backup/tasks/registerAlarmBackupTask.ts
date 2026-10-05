import { AppRegistry } from 'react-native'

export const CARDIOSYNC_HEADLESS_BACKUP_TASK = 'CardioSyncScheduledBackup'

type AlarmTaskData = {
  scheduledAt?: unknown
}

function getScheduledAtTimestamp(taskData: AlarmTaskData): number | undefined {
  return typeof taskData.scheduledAt === 'number' && Number.isFinite(taskData.scheduledAt)
    ? taskData.scheduledAt
    : undefined
}

AppRegistry.registerHeadlessTask(
  CARDIOSYNC_HEADLESS_BACKUP_TASK,
  () => async (taskData: AlarmTaskData) => {
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
