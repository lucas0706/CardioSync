import { useMemo } from 'react'

import {
  ClinicalSeriesKey,
} from '../types/ClinicalSeries'

import {
  getClinicalChartPrimaryMetric,
} from '../utils/getClinicalChartPrimaryMetric'

export function useClinicalChartPrimaryMetric(
  keys: ClinicalSeriesKey[],
) {

  return useMemo(
    () =>
      getClinicalChartPrimaryMetric(
        keys,
      ),
    [keys],
  )
}
