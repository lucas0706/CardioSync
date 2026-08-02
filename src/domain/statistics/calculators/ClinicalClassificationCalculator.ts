import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import type { ClinicalEngine } from '@/clinical/engine'

export interface ClinicalClassificationSummary {
  predominantClassification?: string
  classificationDistribution: Record<string, number>
}

export class ClinicalClassificationCalculator {
  static calculate(
    records: BloodPressureRecord[],
    engine?: ClinicalEngine,
  ): ClinicalClassificationSummary {
    if (!engine || records.length === 0) {
      return {
        classificationDistribution: {},
      }
    }

    const distribution: Record<string, number> = {}

    records.forEach((record) => {
      const result = engine.classify(record)

      distribution[result.classification] =
        (distribution[result.classification] ?? 0) + 1
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
