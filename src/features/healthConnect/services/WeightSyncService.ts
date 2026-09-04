import {
  WeightRecord,
} from '@/domain/health/WeightRecord'

import {
  WeightMapper,
} from '../mappers/WeightMapper'

import {
  readAllRecords,
} from './HealthConnectPagination'

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

    const records =
      await readAllRecords(
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

    return records.map(
      WeightMapper.toDomain,
    )
  }
}

export const weightSyncService =
  new WeightSyncService()
