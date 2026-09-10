import { useMemo } from 'react'

import { ClinicalSeries } from '../types/ClinicalSeries'

export function useClinicalActiveKeys(
  series: ClinicalSeries[],
) {
  return useMemo(
    () =>
      series.map(
        item => item.key,
      ),
    [series],
  )
}
