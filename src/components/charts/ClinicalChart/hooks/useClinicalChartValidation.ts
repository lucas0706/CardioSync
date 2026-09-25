import { useMemo } from 'react'

import {
  ClinicalChartDataPoint,
} from '../types/ClinicalChartData'

import {
  getClinicalChartValidation,
} from '../utils/getClinicalChartValidation'

export function useClinicalChartValidation(
  data: ClinicalChartDataPoint[],
) {
  return useMemo(
    () =>
      getClinicalChartValidation(data),
    [data],
  )
}
