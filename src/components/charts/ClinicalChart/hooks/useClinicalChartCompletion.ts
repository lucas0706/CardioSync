import { useMemo } from 'react'

import {
  getClinicalChartCompletionStatus,
} from '../utils/getClinicalChartCompletionStatus'

export function useClinicalChartCompletion() {

  return useMemo(
    () =>
      getClinicalChartCompletionStatus(),
    [],
  )
}
