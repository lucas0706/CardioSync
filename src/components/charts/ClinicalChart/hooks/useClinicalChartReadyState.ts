import { useMemo } from 'react'

import {
  getClinicalChartReadyState,
} from '../utils/getClinicalChartReadyState'

export function useClinicalChartReadyState() {

  return useMemo(
    () =>
      getClinicalChartReadyState(),
    [],
  )
}
