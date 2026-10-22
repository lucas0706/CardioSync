import type { HeartRateSample } from '@/domain/health/HeartRateSample'

export class HeartRateMapper {
  static toDomain(record: any): HeartRateSample[] {
    if (!Array.isArray(record?.samples)) {
      return []
    }

    return record.samples.flatMap((sample: any): HeartRateSample[] => {
      const bpm = sample?.beatsPerMinute
      const dateTime = sample?.time

      if (
        typeof bpm !== 'number' ||
        !Number.isFinite(bpm) ||
        bpm <= 0 ||
        typeof dateTime !== 'string' ||
        !Number.isFinite(Date.parse(dateTime))
      ) {
        return []
      }

      return [{ dateTime, bpm }]
    })
  }
}
