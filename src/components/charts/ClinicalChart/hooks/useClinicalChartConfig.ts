import { useMemo } from 'react'

import {
  ClinicalSeries,
} from '../types/ClinicalSeries'

import {
  getClinicalChartMode,
} from '../utils/getClinicalChartMode'

import {
  getClinicalChartHeight,
} from '../utils/getClinicalChartHeight'

export function useClinicalChartConfig(
  series: ClinicalSeries[],
) {

  return useMemo(
    () => {

      const keys =
        series.map(
          item => item.key,
        )

      const mode =
        getClinicalChartMode(keys)

      return {
        mode,
        height:
          getClinicalChartHeight(
            mode === 'bloodPressure'
              ? 'mapa'
              : 'standard',
          ),
        keys,
      }

    },
    [series],
  )
}
