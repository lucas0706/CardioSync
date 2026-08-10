import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { BloodPressureClassifier } from '@/domain/clinical/classification'

export interface ClinicalClassificationSummary {
  predominantClassification?: string
  classificationDistribution: Record<string, number>
}

export class ClinicalClassificationCalculator {
  static calculate(
    records: BloodPressureRecord[],
  ): ClinicalClassificationSummary {
    if (records.length === 0) {
      return {
        classificationDistribution: {},
      }
    }

    const distribution: Record<string, number> = {}

    records.forEach((record) => {
      const result = BloodPressureClassifier.classify(
        record.systolic,
        record.diastolic,
      )

      distribution[result.category] =
        (distribution[result.category] ?? 0) + 1
    })

    const predominantClassification =
      Object.entries(distribution)
        .sort((a, b) => b[1] - a[1])[0]?.[0]

    return {
      predominantClassification,
      classificationDistribution: distribution,
    }
  }
}
