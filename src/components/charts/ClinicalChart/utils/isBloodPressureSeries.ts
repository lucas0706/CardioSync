import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export function isBloodPressureSeries(
  key: ClinicalSeriesKey,
): boolean {

  return (
    key === 'systolic' ||
    key === 'diastolic'
  )
}
