import { HeartRateSample } from '@/domain/health/HeartRateSample'

export class HeartRateMapper {
  static toDomain(
    record: any,
  ): HeartRateSample {
    return {
      dateTime:
        record.samples?.[0]?.time ??
        record.startTime ??
        '',

      bpm:
        record.samples?.[0]?.beatsPerMinute ??
        0,
    }
  }
}
