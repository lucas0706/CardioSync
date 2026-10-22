import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export class AdherenceCalculator {
  static calculate(
    records: BloodPressureRecord[],
  ): number | undefined {

    const ordered = [...records]
      .filter(record => {
        const timestamp = new Date(record.dateTime).getTime()
        return Number.isFinite(timestamp)
      })
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() -
            new Date(b.dateTime).getTime() ||
          a.id.localeCompare(b.id),
      )

    if (ordered.length <= 1) return undefined

    let consecutive = 0

    for (let i = 1; i < ordered.length; i++) {
      const previous = new Date(ordered[i - 1].dateTime)
      const current = new Date(ordered[i].dateTime)

      const days =
        (current.getTime() - previous.getTime()) /
        86400000

      if (days <= 2) {
        consecutive++
      }
    }

    return (consecutive / (ordered.length - 1)) * 100
  }
}
