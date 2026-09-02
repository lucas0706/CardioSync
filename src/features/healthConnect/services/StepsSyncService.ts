import {
  readRecords,
} from 'react-native-health-connect'

import { StepRecord } from '@/domain/health/StepRecord'

import { StepsMapper } from '../mappers/StepsMapper'

export class StepsSyncService {
  async readLast30Days(): Promise<
    StepRecord[]
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
        'Steps',
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
      StepsMapper.toDomain,
    )
  }
}

export const stepsSyncService =
  new StepsSyncService()
