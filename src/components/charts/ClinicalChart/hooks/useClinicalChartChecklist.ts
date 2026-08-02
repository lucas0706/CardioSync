import { useMemo } from 'react'

import {
  getClinicalChartFinalChecklist,
} from '../utils/getClinicalChartFinalChecklist'

export function useClinicalChartChecklist() {

  return useMemo(
    () =>
      getClinicalChartFinalChecklist(),
    [],
  )
}
