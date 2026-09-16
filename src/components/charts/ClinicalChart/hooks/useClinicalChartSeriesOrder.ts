import { useMemo } from 'react'

import { ClinicalSeriesKey } from '../types/ClinicalSeries'

import { getClinicalChartSeriesOrder } from '../utils/getClinicalChartSeriesOrder'

export function useClinicalChartSeriesOrder(
  series: ClinicalSeriesKey[],
) {
  return useMemo(
    () =>
      getClinicalChartSeriesOrder(series),
    [series],
  )
}
