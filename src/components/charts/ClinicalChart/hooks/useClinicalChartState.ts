import { useMemo } from 'react'

import {
  getClinicalChartState,
} from '../utils/getClinicalChartState'

export function useClinicalChartState(
  loading: boolean,
  hasData: boolean,
) {
  return useMemo(
    () =>
      getClinicalChartState(
        loading,
        hasData,
      ),
    [
      loading,
      hasData,
    ],
  )
}
