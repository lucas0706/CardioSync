import { useMemo } from 'react'

import { getClinicalChartHeight } from '../utils/getClinicalChartHeight'

export function useClinicalChartHeight(
  mode: 'standard' | 'compact' | 'mapa',
) {
  return useMemo(
    () =>
      getClinicalChartHeight(mode),
    [mode],
  )
}
