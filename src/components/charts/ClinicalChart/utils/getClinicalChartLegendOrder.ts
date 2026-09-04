import { ClinicalSeriesKey } from '../types/ClinicalSeries'

const PRIORITY: ClinicalSeriesKey[] = [
  'systolic',
  'diastolic',
  'heartRate',
  'weight',
  'glucose',
  'spo2',
  'temperature',
  'respiratoryRate',
]

export function getClinicalChartLegendOrder(
  keys: ClinicalSeriesKey[],
): ClinicalSeriesKey[] {

  return PRIORITY.filter(
    key => keys.includes(key),
  )
}
