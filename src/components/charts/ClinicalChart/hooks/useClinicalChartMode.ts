import { useMemo } from 'react'

import { getClinicalChartMode } from '../utils/getClinicalChartMode'

export function useClinicalChartMode(
  keys: string[],
) {
  return useMemo(
    () =>
      getClinicalChartMode(keys),
    [keys],
  )
}
