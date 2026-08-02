import { useMemo } from 'react'

import { getClinicalChartXAxis } from '../utils/getClinicalChartXAxis'

export function useClinicalXAxis(
  mode: 'standard' | 'compact' | 'mapa',
) {
  return useMemo(
    () =>
      getClinicalChartXAxis(mode),
    [mode],
  )
}
