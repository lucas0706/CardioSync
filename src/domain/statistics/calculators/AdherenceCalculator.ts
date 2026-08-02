import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export class AdherenceCalculator {
  static calculate(records: BloodPressureRecord[]): number {
    if (records.length <= 1) return 100

    const ordered = [...records].sort(
      (a, b) =>
        new Date(a.dateTime).getTime() -
        new Date(b.dateTime).getTime(),
    )

    let consecutive = 0

    for (let i = 1; i < ordered.length; i++) {
      const previous = new Date(ordered[i - 1].dateTime)
      const current = new Date(ordered[i].dateTime)

      const days =
        Math.abs(current.getTime() - previous.getTime()) /
        86400000

      if (days <= 2) {
        consecutive++
      }
    }

    return (consecutive / (ordered.length - 1)) * 100
  }
}
