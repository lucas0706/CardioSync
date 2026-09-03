import {
  aggregateRecord,
} from 'react-native-health-connect'

export class HealthAggregateService {
  async getTodaySteps(): Promise<number> {
    const startTime = new Date()

    startTime.setHours(
      0,
      0,
      0,
      0,
    )

    const result =
      await aggregateRecord({
        recordType: 'Steps',
        timeRangeFilter: {
          operator: 'between',
          startTime:
            startTime.toISOString(),
          endTime:
            new Date().toISOString(),
        },
      })

    console.log(
      '[HC AGG STEPS]',
      result,
    )

    return result.COUNT_TOTAL ?? 0
  }

  async getTodayHeartRateAverage(): Promise<number> {
    const startTime = new Date()

    startTime.setHours(
      0,
      0,
      0,
      0,
    )

    const result =
      await aggregateRecord({
        recordType: 'HeartRate',
        timeRangeFilter: {
          operator: 'between',
          startTime:
            startTime.toISOString(),
          endTime:
            new Date().toISOString(),
        },
      })

    console.log(
      '[HC AGG HEART]',
      result,
    )

    return Math.round(
      result.BPM_AVG ?? 0,
    )
  }
}

export const
  healthAggregateService =
    new HealthAggregateService()
