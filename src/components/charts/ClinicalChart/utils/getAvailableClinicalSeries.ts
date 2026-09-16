import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { clinicalSeries } from '../constants/clinicalSeries'

export function getAvailableClinicalSeries(
  records: BloodPressureRecord[],
) {
  return clinicalSeries.filter(series =>
    records.some(record => {
      const value =
        record[series.key]

      return (
        typeof value === 'number' &&
        Number.isFinite(value)
      )
    }),
  )
}
