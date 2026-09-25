import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export function getClinicalChartPrimaryMetric(
  keys: ClinicalSeriesKey[],
): ClinicalSeriesKey | undefined {

  const priority: ClinicalSeriesKey[] = [
    'systolic',
    'diastolic',
    'heartRate',
    'weight',
    'glucose',
    'spo2',
    'temperature',
    'respiratoryRate',
  ]

  return priority.find(
    key =>
      keys.includes(key),
  )
}
