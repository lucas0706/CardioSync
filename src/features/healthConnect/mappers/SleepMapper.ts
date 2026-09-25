import { SleepSessionRecord } from '@/domain/health/SleepSessionRecord'

export class SleepMapper {
  static toDomain(
    record: any,
  ): SleepSessionRecord {
    const start =
      new Date(record.startTime)

    const end =
      new Date(record.endTime)

    const durationMinutes =
      Math.round(
        (end.getTime() -
          start.getTime()) /
          60000,
      )

    return {
      startTime:
        record.startTime ?? '',
      endTime:
        record.endTime ?? '',
      durationMinutes,
      title:
        record.title,
    }
  }
}
