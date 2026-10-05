import { AppRegistry } from 'react-native'

import { initializeDatabase } from '@/core/database/init'
import { runHeadlessScheduledBackup } from '@/features/backup/services/ScheduledBackupService'

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
    initializeDatabase()

    await runHeadlessScheduledBackup(getScheduledAtTimestamp(taskData))
  },
)
