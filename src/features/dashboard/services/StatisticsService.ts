import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export class StatisticsService {
  constructor(
    private readonly records: BloodPressureRecord[],
  ) {}

  get total() {
    return this.records.length
  }

  get averageSystolic() {
    return Math.round(
      this.records.reduce((s, r) => s + r.systolic, 0) /
        this.records.length,
    )
  }

  get averageDiastolic() {
    return Math.round(
      this.records.reduce((s, r) => s + r.diastolic, 0) /
        this.records.length,
    )
  }

  get maxSystolic() {
    return Math.max(...this.records.map((r) => r.systolic))
  }

  get minSystolic() {
    return Math.min(...this.records.map((r) => r.systolic))
  }

  get maxDiastolic() {
    return Math.max(...this.records.map((r) => r.diastolic))
  }

  get minDiastolic() {
    return Math.min(...this.records.map((r) => r.diastolic))
  }

  get averageHeartRate() {
    const hr = this.records
      .map((r) => r.heartRate)
      .filter((v): v is number => v !== undefined)

    if (!hr.length) return null

    return Math.round(
      hr.reduce((a, b) => a + b, 0) / hr.length,
    )
  }
}
