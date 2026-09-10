import { WeightRecord } from '@/domain/health/WeightRecord'

export class WeightMapper {
  static toDomain(
    record: any,
  ): WeightRecord {
    return {
      weightKg:
        record.weight?.inKilograms ??
        0,

      dateTime:
        record.time ??
        '',
    }
  }
}
