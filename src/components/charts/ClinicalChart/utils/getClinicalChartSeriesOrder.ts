import { ClinicalSeriesKey } from '../types/ClinicalSeries'

const ORDER: ClinicalSeriesKey[] = [
  'systolic',
  'diastolic',
  'heartRate',
  'weight',
  'glucose',
  'spo2',
  'temperature',
  'respiratoryRate',
]

export function getClinicalChartSeriesOrder(
  series: ClinicalSeriesKey[],
): ClinicalSeriesKey[] {

  return ORDER.filter(
    key => series.includes(key),
  )
}
