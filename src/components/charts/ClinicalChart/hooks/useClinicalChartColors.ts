import { useMemo } from 'react'

import {
  clinicalColorMap,
} from '../utils/getClinicalChartColorMap'

export function useClinicalChartColors() {

  return useMemo(
    () =>
      clinicalColorMap,
    [],
  )
}
