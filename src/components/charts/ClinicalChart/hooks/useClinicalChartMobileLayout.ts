import { useMemo } from 'react'

import {
  getClinicalChartMobileLayout,
} from '../utils/getClinicalChartMobileLayout'

export function useClinicalChartMobileLayout(
  width: number,
) {

  return useMemo(
    () =>
      getClinicalChartMobileLayout(
        width,
      ),
    [
      width,
    ],
  )
}
