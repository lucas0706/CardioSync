import { useMemo } from 'react'

import {
  getClinicalChartTouchData,
} from '../utils/getClinicalChartTouchData'

export function useClinicalChartTouch(
  active: boolean,
  index?: number,
) {

  return useMemo(
    () =>
      getClinicalChartTouchData(
        active,
        index,
      ),
    [
      active,
      index,
    ],
  )
}
