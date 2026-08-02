import { useMemo } from 'react'

import {
  getClinicalChartEmptyState,
} from '../utils/getClinicalChartEmptyState'

export function useClinicalEmptyState(
  hasRecords: boolean,
) {
  return useMemo(
    () =>
      getClinicalChartEmptyState(
        hasRecords,
      ),
    [hasRecords],
  )
}
