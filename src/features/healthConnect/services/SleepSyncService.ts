import {
  readRecords,
} from 'react-native-health-connect'

import { SleepSessionRecord } from '@/domain/health/SleepSessionRecord'

import { SleepMapper } from '../mappers/SleepMapper'

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

    const result =
      await readRecords(
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

    return result.records.map(
      SleepMapper.toDomain,
    )
  }
}

export const sleepSyncService =
  new SleepSyncService()
