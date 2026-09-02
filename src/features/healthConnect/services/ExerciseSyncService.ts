import {
  readRecords,
} from 'react-native-health-connect'

import { ExerciseSessionRecord } from '@/domain/health/ExerciseSessionRecord'

import { ExerciseMapper } from '../mappers/ExerciseMapper'

export class ExerciseSyncService {
  async readLast30Days(): Promise<
    ExerciseSessionRecord[]
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
        'ExerciseSession',
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
      ExerciseMapper.toDomain,
    )
  }
}

export const exerciseSyncService =
  new ExerciseSyncService()
