import { useMemo } from 'react'

import { ClinicalSeries } from '../types/ClinicalSeries'

export function useClinicalSeries(
  series: ClinicalSeries[],
) {
  return useMemo(
    () => series.filter(Boolean),
    [series],
  )
}
