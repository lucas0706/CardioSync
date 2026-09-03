import {
  readRecords,
} from 'react-native-health-connect'

import { HeartRateMapper }
  from '../mappers/HeartRateMapper'

export class HeartRateSyncService {
  async readLast30Days() {
    const endTime = new Date()

    const startTime = new Date()

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

    console.log(
      '[HEART RATE RAW RECORD]',
      JSON.stringify(
        result.records[0],
        null,
        2,
      ),
    )

    return result.records.map(
      HeartRateMapper.toDomain,
    )
  }
}

export const heartRateSyncService =
  new HeartRateSyncService()
