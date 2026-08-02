import { useMemo } from 'react'

import { ClinicalSeriesKey } from '../types/ClinicalSeries'

import {
  getClinicalChartRenderConfig,
} from '../utils/getClinicalChartRenderConfig'

export function useClinicalChartRenderConfig(
  keys: ClinicalSeriesKey[],
) {

  return useMemo(
    () =>
      getClinicalChartRenderConfig(
        keys,
      ),
    [keys],
  )
}
