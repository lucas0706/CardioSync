import { useMemo } from 'react'

import {
  ClinicalSeries,
} from '../types/ClinicalSeries'

export function useClinicalChartActiveSeries(
  series: ClinicalSeries[],
) {

  return useMemo(
    () =>
      series.filter(
        item =>
          Boolean(item),
      ),
    [series],
  )
}
