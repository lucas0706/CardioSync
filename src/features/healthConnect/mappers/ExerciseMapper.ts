import { ExerciseSessionRecord } from '@/domain/health/ExerciseSessionRecord'

export class ExerciseMapper {
  static toDomain(
    record: any,
  ): ExerciseSessionRecord {
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
      exerciseType:
        String(
          record.exerciseType ??
            'unknown',
        ),
      title:
        record.title,
    }
  }
}
