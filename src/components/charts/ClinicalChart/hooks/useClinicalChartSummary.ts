import { useMemo } from 'react'

import {
  ClinicalChartDataPoint,
} from '../types/ClinicalChartData'

import {
  ClinicalSeriesKey,
} from '../types/ClinicalSeries'

import {
  getClinicalChartSummary,
} from '../utils/getClinicalChartSummary'

export function useClinicalChartSummary(
  data: ClinicalChartDataPoint[],
  keys: ClinicalSeriesKey[],
) {
  return useMemo(
    () =>
      getClinicalChartSummary(
        data,
        keys,
      ),
    [
      data,
      keys,
    ],
  )
}
