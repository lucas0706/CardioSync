import { StepRecord } from '@/domain/health/StepRecord'

export class StepsMapper {
  static toDomain(
    record: any,
  ): StepRecord {
    return {
      startTime:
        record.startTime ?? '',
      endTime:
        record.endTime ?? '',
      count:
        record.count ?? 0,
    }
  }
}
