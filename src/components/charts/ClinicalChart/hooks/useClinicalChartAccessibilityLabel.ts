import { useMemo } from 'react'

import {
  ClinicalSeriesKey,
} from '../types/ClinicalSeries'

import {
  getClinicalChartAccessibilityLabel,
} from '../utils/getClinicalChartAccessibilityLabel'

export function useClinicalChartAccessibilityLabel(
  keys: ClinicalSeriesKey[],
) {

  return useMemo(
    () =>
      getClinicalChartAccessibilityLabel(
        keys,
      ),
    [
      keys,
    ],
  )
}
