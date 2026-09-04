import {
  ExerciseSessionRecord,
} from '@/domain/health/ExerciseSessionRecord'

import {
  ExerciseMapper,
} from '../mappers/ExerciseMapper'

import {
  readAllRecords,
} from './HealthConnectPagination'

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

    const records =
      await readAllRecords(
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

    return records.map(
      ExerciseMapper.toDomain,
    )
  }
}

export const exerciseSyncService =
  new ExerciseSyncService()
