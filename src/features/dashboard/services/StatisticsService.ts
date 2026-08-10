import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import type { BloodPressureCategory } from '@/domain/clinical/classification'
import { BloodPressureClassifier } from '@/domain/clinical/classification'

export class StatisticsService {
  constructor(
    private readonly records: BloodPressureRecord[],
  ) {}


  get total() {
    return this.records.length
  }

  get averageSystolic() {
    return Math.round(
      this.records.reduce((sum, record) => sum + record.systolic, 0) /
        this.records.length,
    )
  }

  get averageDiastolic() {
    return Math.round(
      this.records.reduce((sum, record) => sum + record.diastolic, 0) /
        this.records.length,
    )
  }

  get maxSystolic() {
    return Math.max(...this.records.map((record) => record.systolic))
  }

  get minSystolic() {
    return Math.min(...this.records.map((record) => record.systolic))
  }

  get maxDiastolic() {
    return Math.max(...this.records.map((record) => record.diastolic))
  }

  get minDiastolic() {
    return Math.min(...this.records.map((record) => record.diastolic))
  }

  get averageHeartRate() {
    const values = this.records
      .map((record) => record.heartRate)
      .filter((value): value is number => value !== undefined)

    if (!values.length) {
      return null
    }

    return Math.round(
      values.reduce((sum, value) => sum + value, 0) /
        values.length,
    )
  }

  get predominantClassification() {
    const map = new Map<
      BloodPressureCategory,
      {
        count: number
        label: string
      }
    >()

    this.records.forEach((record) => {
      const result = BloodPressureClassifier.classify(
        record.systolic,
        record.diastolic,
      )

      const current = map.get(result.category)

      map.set(result.category, {
        count: (current?.count ?? 0) + 1,
        label: result.label,
      })
    })

    return (
      [...map.values()].sort(
        (a, b) => b.count - a.count,
      )[0]?.label ?? '-'
    )
  }

  get normalPercentage() {
    if (!this.records.length) {
      return 0
    }

    const normal = this.records.filter(
      (record) =>
        BloodPressureClassifier.classify(
          record.systolic,
          record.diastolic,
        ).category === 'normal',
    ).length

    return Math.round(
      (normal / this.records.length) * 100,
    )
  }
}
