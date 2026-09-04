import { useMemo } from 'react'

import {
  getClinicalChartZoomConfig,
} from '../utils/getClinicalChartZoomConfig'

export function useClinicalChartZoom(
  mode: 'standard' | 'compact' | 'mapa',
) {

  return useMemo(
    () =>
      getClinicalChartZoomConfig(
        mode,
      ),
    [mode],
  )
}
