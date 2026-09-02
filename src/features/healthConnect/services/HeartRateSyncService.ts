import {
  readRecords,
} from 'react-native-health-connect'

import { HeartRateSample } from '@/domain/health/HeartRateSample'

import { HeartRateMapper } from '../mappers/HeartRateMapper'

export class HeartRateSyncService {
  async readLast30Days(): Promise<
    HeartRateSample[]
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
        'HeartRate',
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
      HeartRateMapper.toDomain,
    )
  }
}

export const heartRateSyncService =
  new HeartRateSyncService()
