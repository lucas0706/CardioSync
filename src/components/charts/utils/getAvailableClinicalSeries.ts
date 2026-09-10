import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { defaultClinicalSeries } from '../constants/clinicalSeries'
import { ClinicalSeries } from '../types/ClinicalSeries'

export function getAvailableClinicalSeries(
  records: BloodPressureRecord[],
): ClinicalSeries[] {
  return defaultClinicalSeries.filter(
    (series) =>
      records.some(
        (record) =>
          record[
            series.key
          ] !== undefined,
      ),
  )
}
