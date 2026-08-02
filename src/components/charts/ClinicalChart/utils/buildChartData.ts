import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

export function buildChartData(
  records: BloodPressureRecord[],
): ClinicalChartDataPoint[] {
  return records
    .map(record => ({
      date: record.dateTime,
      systolic: record.systolic,
      diastolic: record.diastolic,
      heartRate: record.heartRate,
      weight: record.weight,
      glucose: record.glucose,
      spo2: record.spo2,
      temperature: record.temperature,
      respiratoryRate: record.respiratoryRate,
    }))
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
}
