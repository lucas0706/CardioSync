export type ClinicalSeriesKey =
  | 'systolic'
  | 'diastolic'
  | 'heartRate'
  | 'weight'
  | 'glucose'
  | 'spo2'
  | 'temperature'
  | 'respiratoryRate'

export interface ClinicalSeries {
  key: ClinicalSeriesKey
  label: string
  color: string
  unit: string
  symbol: 'square' | 'circle' | 'triangle'
}
