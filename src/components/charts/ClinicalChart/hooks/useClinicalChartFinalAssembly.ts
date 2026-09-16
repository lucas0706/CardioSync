import { useMemo } from 'react'

import {
  getClinicalChartFinalAssembly,
} from '../utils/getClinicalChartFinalAssembly'

export function useClinicalChartFinalAssembly() {

  return useMemo(
    () =>
      getClinicalChartFinalAssembly(),
    [],
  )
}
