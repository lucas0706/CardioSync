import { useMemo } from 'react'

import {
  getClinicalChartPerformance,
} from '../utils/getClinicalChartPerformance'

export function useClinicalPerformance(
  points: number,
) {
  return useMemo(
    () =>
      getClinicalChartPerformance(points),
    [points],
  )
}
