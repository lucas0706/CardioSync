import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import type { ClinicalChartDataPoint } from '../types/ClinicalChartData'

function toNumber(
  value: unknown,
): number | undefined {
  if (
    typeof value === 'number' &&
    Number.isFinite(value)
  ) {
    return value
  }

  if (
    typeof value === 'string' &&
    value.trim() !== ''
  ) {
    const parsed = Number(value)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
}

export function buildChartData(
  records: BloodPressureRecord[],
): ClinicalChartDataPoint[] {
  return records
    .map(record => ({
      date: record.dateTime,

      systolic:
        toNumber(record.systolic),

      diastolic:
        toNumber(record.diastolic),

      heartRate:
        toNumber(record.heartRate),

      weight:
        toNumber(record.weight),

      glucose:
        toNumber(record.glucose),

      spo2:
        toNumber(record.spo2),

      temperature:
        toNumber(record.temperature),

      respiratoryRate:
        toNumber(record.respiratoryRate),
    }))
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
}
