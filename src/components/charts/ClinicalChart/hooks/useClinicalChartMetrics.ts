import { useMemo } from 'react'

import {
  ClinicalChartDataPoint,
} from '../types/ClinicalChartData'

import {
  getClinicalChartMetrics,
} from '../utils/getClinicalChartMetrics'

export function useClinicalChartMetrics(
  data: ClinicalChartDataPoint[],
) {

  return useMemo(
    () =>
      getClinicalChartMetrics(
        data,
      ),
    [data],
  )
}
