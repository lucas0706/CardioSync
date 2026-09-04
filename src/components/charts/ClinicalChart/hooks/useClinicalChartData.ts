import { useMemo } from 'react'

import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { buildChartData } from '../utils/buildChartData'
import { downsampleClinicalData } from '../utils/downsampleClinicalData'

export function useClinicalChartData(
  records: BloodPressureRecord[],
) {
  return useMemo(
    () =>
      downsampleClinicalData(
        buildChartData(records),
      ),
    [records],
  )
}
