import {
  StepRecord,
} from '@/domain/health/StepRecord'

import {
  StepsMapper,
} from '../mappers/StepsMapper'

import {
  readAllRecords,
} from './HealthConnectPagination'

const STEP_ORIGIN_PRIORITY = [
  'com.google.android.apps.fitness',
  'nl.appyhapps.healthsync',
  'com.fitbit.FitbitMobile',
]

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

    const records =
      await readAllRecords(
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

    console.log(
      '[STEPS TOTAL RECORDS]',
      records.length,
    )

    const selectedOrigin =
      STEP_ORIGIN_PRIORITY.find(
        origin =>
          records.some(
            (record: any) =>
              record.metadata
                ?.dataOrigin ===
              origin,
          ),
      )

    const filteredRecords =
      selectedOrigin
        ? records.filter(
            (record: any) =>
              record.metadata
                ?.dataOrigin ===
              selectedOrigin,
          )
        : records

    console.log(
      '[STEPS SELECTED ORIGIN]',
      selectedOrigin ??
        'ALL',
    )

    console.log(
      '[STEPS FILTERED RECORDS]',
      filteredRecords.length,
    )

    return filteredRecords.map(
      StepsMapper.toDomain,
    )
  }
}

export const stepsSyncService =
  new StepsSyncService()
