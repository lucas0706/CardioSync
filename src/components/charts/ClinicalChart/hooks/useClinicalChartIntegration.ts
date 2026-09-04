import { useMemo } from 'react'

import {
  ClinicalSeries,
} from '../types/ClinicalSeries'

import {
  getClinicalChartMode,
} from '../utils/getClinicalChartMode'

import {
  getClinicalTargetLines,
} from '../utils/getClinicalTargetLines'

export function useClinicalChartIntegration(
  series: ClinicalSeries[],
) {

  return useMemo(
    () => {

      const keys =
        series.map(
          item => item.key,
        )

      return {
        mode:
          getClinicalChartMode(
            keys,
          ),

        targets:
          getClinicalTargetLines(
            keys,
          ),

        keys,
      }

    },
    [series],
  )
}
