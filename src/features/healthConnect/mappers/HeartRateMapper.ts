import { HeartRateSample } from '@/domain/health/HeartRateSample'

export class HeartRateMapper {
  static toDomain(
    record: any,
  ): HeartRateSample {
    return {
      dateTime:
        record.time ??
        record.startTime ??
        '',

      bpm:
        record.beatsPerMinute ?? 0,
    }
  }
}
