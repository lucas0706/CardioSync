import { useMemo } from 'react'

import {
  ClinicalSeriesKey,
} from '../types/ClinicalSeries'

import {
  getClinicalChartStroke,
} from '../utils/getClinicalChartStroke'

export function useClinicalChartStroke(
  key: ClinicalSeriesKey,
) {

  return useMemo(
    () =>
      getClinicalChartStroke(
        key,
      ),
    [key],
  )
}
