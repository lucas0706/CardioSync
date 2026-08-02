import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { clinicalSeries } from '../constants/clinicalSeries'

export function getAvailableClinicalSeries(
  records: BloodPressureRecord[],
) {
  return clinicalSeries.filter(series =>
    records.some(record => record[series.key] !== undefined),
  )
}
