import { ClinicalChartDataPoint } from '../types/ClinicalChartData'
import { ClinicalSeries } from '../types/ClinicalSeries'

export type ClinicalNumericKey =
  | 'systolic'
  | 'diastolic'
  | 'heartRate'
  | 'weight'
  | 'glucose'
  | 'spo2'
  | 'temperature'
  | 'respiratoryRate'

export type ClinicalNumericFields =
  Pick<
    ClinicalChartDataPoint,
    ClinicalNumericKey
  >

export function getClinicalYKeys(
  series: ClinicalSeries[],
): ClinicalNumericKey[] {
  return series.map(
    (item) => item.key,
  )
}
