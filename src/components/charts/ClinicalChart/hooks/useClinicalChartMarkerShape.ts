import { useMemo } from 'react'

import {
  ClinicalSeriesKey,
} from '../types/ClinicalSeries'

import {
  getClinicalChartMarkerShape,
} from '../utils/getClinicalChartMarkerShape'

export function useClinicalChartMarkerShape(
  key: ClinicalSeriesKey,
) {

  return useMemo(
    () =>
      getClinicalChartMarkerShape(
        key,
      ),
    [
      key,
    ],
  )
}
