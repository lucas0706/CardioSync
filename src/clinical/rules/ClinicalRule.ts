import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { ClinicalAnalysis } from '../models/ClinicalAnalysis'

export interface ClinicalRule {
  id: string

  analyze(
    record: BloodPressureRecord,
  ): ClinicalAnalysis
}
