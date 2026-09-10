import { useMemo } from 'react'

import {
  getClinicalChartInteractionMode,
} from '../utils/getClinicalChartInteractionMode'

export function useClinicalChartInteractionMode(
  hasManyPoints: boolean,
) {

  return useMemo(
    () =>
      getClinicalChartInteractionMode(
        hasManyPoints,
      ),
    [hasManyPoints],
  )
}
