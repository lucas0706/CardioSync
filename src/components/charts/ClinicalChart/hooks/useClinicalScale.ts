import { useMemo } from 'react'

import { ClinicalChartDataPoint } from '../types/ClinicalChartData'
import { ClinicalSeriesKey } from '../types/ClinicalSeries'

import { getClinicalScale } from '../utils/getClinicalScale'

export function useClinicalScale(
  data: ClinicalChartDataPoint[],
  key: ClinicalSeriesKey,
) {
  return useMemo(
    () => getClinicalScale(data, key),
    [data, key],
  )
}
