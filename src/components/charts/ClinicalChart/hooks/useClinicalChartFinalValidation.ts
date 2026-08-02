import { useMemo } from 'react'

import {
  getClinicalChartFinalValidation,
} from '../utils/getClinicalChartFinalValidation'

export function useClinicalChartFinalValidation() {

  return useMemo(
    () =>
      getClinicalChartFinalValidation(),
    [],
  )
}
