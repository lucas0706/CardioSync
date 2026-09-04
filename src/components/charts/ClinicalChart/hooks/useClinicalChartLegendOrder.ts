import { useMemo } from 'react'

import { ClinicalSeriesKey } from '../types/ClinicalSeries'

import {
  getClinicalChartLegendOrder,
} from '../utils/getClinicalChartLegendOrder'

export function useClinicalChartLegendOrder(
  keys: ClinicalSeriesKey[],
) {
  return useMemo(
    () =>
      getClinicalChartLegendOrder(keys),
    [keys],
  )
}
