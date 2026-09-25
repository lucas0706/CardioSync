import { useMemo } from 'react'

import { getClinicalChartPadding } from '../utils/getClinicalChartPadding'

export function useClinicalChartLayout(
  mode: 'standard' | 'compact' | 'mapa',
) {
  return useMemo(
    () => ({
      height:
        mode === 'mapa'
          ? 420
          : 360,

      padding:
        getClinicalChartPadding(mode),
    }),
    [mode],
  )
}
