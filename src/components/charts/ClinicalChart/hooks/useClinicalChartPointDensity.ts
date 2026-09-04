import { useMemo } from 'react'

import {
  getClinicalChartPointDensity,
} from '../utils/getClinicalChartPointDensity'

export function useClinicalChartPointDensity(
  count: number,
) {

  return useMemo(
    () =>
      getClinicalChartPointDensity(
        count,
      ),
    [count],
  )
}
