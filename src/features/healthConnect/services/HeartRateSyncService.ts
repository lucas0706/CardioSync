import {
  readAllRecords,
} from './HealthConnectPagination'

import {
  HeartRateMapper,
} from '../mappers/HeartRateMapper'

export class HeartRateSyncService {
  async readLast30Days() {
    const endTime =
      new Date()

    const startTime =
      new Date()

    startTime.setDate(
      startTime.getDate() - 30,
    )

    const records =
      await readAllRecords(
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
      '[HEART RAW SAMPLE]',
      JSON.stringify(
        records[0],
        null,
        2,
      ),
    )

    return records.map(
      HeartRateMapper.toDomain,
    )
  }
}

export const heartRateSyncService =
  new HeartRateSyncService()
