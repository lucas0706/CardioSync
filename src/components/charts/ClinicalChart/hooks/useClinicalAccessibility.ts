import { useMemo } from 'react'

import {
  getClinicalChartAccessibility,
} from '../utils/getClinicalChartAccessibility'

export function useClinicalAccessibility(
  variables: string[],
) {
  return useMemo(
    () =>
      getClinicalChartAccessibility(
        variables,
      ),
    [variables],
  )
}
