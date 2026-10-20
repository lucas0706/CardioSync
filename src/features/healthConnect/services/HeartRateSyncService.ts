import { readAllRecords } from './HealthConnectPagination'
import { HeartRateMapper } from '../mappers/HeartRateMapper'

export class HeartRateSyncService {
  async readLast30Days() {
    const endTime = new Date()
    const startTime = new Date()

    startTime.setDate(startTime.getDate() - 30)

    const records = await readAllRecords('HeartRate', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    })

    return records.flatMap((record) => HeartRateMapper.toDomain(record))
  }
}

export const heartRateSyncService = new HeartRateSyncService()
