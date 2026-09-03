import {
  readRecords,
} from 'react-native-health-connect'

import { WeightRecord } from '@/domain/health/WeightRecord'

import { WeightMapper } from '../mappers/WeightMapper'

export class WeightSyncService {
  async readLast30Days(): Promise<
    WeightRecord[]
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
        'Weight',
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
      WeightMapper.toDomain,
    )
  }
}

export const weightSyncService =
  new WeightSyncService()
