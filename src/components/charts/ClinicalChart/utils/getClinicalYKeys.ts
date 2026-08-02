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

export function getClinicalYKeys(
  series: ClinicalSeries[],
): ClinicalNumericKey[] {
  return series.map(item => item.key)
}
