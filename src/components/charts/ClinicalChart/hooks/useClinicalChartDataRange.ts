import { useMemo } from 'react'

import {
  ClinicalChartDataPoint,
} from '../types/ClinicalChartData'

import {
  getClinicalChartDataRange,
} from '../utils/getClinicalChartDataRange'

export function useClinicalChartDataRange(
  data: ClinicalChartDataPoint[],
) {

  return useMemo(
    () =>
      getClinicalChartDataRange(
        data,
      ),
    [data],
  )
}
