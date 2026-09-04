import {
  SleepSessionRecord,
} from '@/domain/health/SleepSessionRecord'

import {
  SleepMapper,
} from '../mappers/SleepMapper'

import {
  readAllRecords,
} from './HealthConnectPagination'

export class SleepSyncService {
  async readLast30Days(): Promise<
    SleepSessionRecord[]
  > {
    const endTime =
      new Date()

    const startTime =
      new Date()

    startTime.setDate(
      startTime.getDate() - 30,
    )

    const records =
      await readAllRecords(
        'SleepSession',
        {
          timeRangeFilter: {
            operator: 'between',
            startTime:
              startTime.toISOString(),
            endTime:
              endTime.toISOString(),
          },
        },
      )

    return records.map(
      SleepMapper.toDomain,
    )
  }
}

export const sleepSyncService =
  new SleepSyncService()
