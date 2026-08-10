import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export interface ClinicalResult {
  classification: string
  color: string
  guideline: string
}

export interface ClinicalGuideEngine {
  id: string

  classify(
    record: BloodPressureRecord,
  ): ClinicalResult
}

export class ClinicalEngine {
  constructor(
    private readonly guide: ClinicalGuideEngine,
  ) {}

  classify(
    record: BloodPressureRecord,
  ): ClinicalResult {
    return this.guide.classify(record)
  }
}
