import { useMemo } from 'react'

import {
  ClinicalSeriesKey,
} from '../types/ClinicalSeries'

import {
  getClinicalChartLineStyle,
} from '../utils/getClinicalChartLineStyle'

export function useClinicalChartLineStyle(
  key: ClinicalSeriesKey,
) {

  return useMemo(
    () =>
      getClinicalChartLineStyle(
        key,
      ),
    [key],
  )
}
