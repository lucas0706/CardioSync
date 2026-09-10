import { useMemo } from 'react'

import {
  ClinicalSeriesKey,
} from '../types/ClinicalSeries'

import {
  getClinicalChartMarkerSize,
} from '../utils/getClinicalChartMarkerSize'

export function useClinicalChartMarkerSize(
  key: ClinicalSeriesKey,
  density: 'low' | 'medium' | 'high',
) {

  return useMemo(
    () =>
      getClinicalChartMarkerSize(
        key,
        density,
      ),
    [
      key,
      density,
    ],
  )
}
