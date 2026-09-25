import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

export function buildChartData(
  records: BloodPressureRecord[],
): ClinicalChartDataPoint[] {
  return records
    .map((record) => ({
      date: record.dateTime,
      systolic: record.systolic,
      diastolic: record.diastolic,
    }))
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
}
