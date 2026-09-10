import { useMemo } from 'react'

import {
  getClinicalChartResponsiveMode,
} from '../utils/getClinicalChartResponsiveMode'

export function useClinicalChartResponsiveMode(
  width: number,
) {

  return useMemo(
    () =>
      getClinicalChartResponsiveMode(
        width,
      ),
    [
      width,
    ],
  )
}
