import { useMemo } from 'react'

import {
  ClinicalChartDataPoint,
} from '../types/ClinicalChartData'

import {
  ClinicalSeries,
} from '../types/ClinicalSeries'

import {
  buildClinicalTooltipValues,
} from '../utils/buildClinicalTooltipValues'

export function useClinicalTooltipValues(
  point: ClinicalChartDataPoint | undefined,
  series: ClinicalSeries[],
) {

  return useMemo(
    () => {

      if (!point) {
        return []
      }

      return buildClinicalTooltipValues(
        point,
        series,
      )
    },
    [
      point,
      series,
    ],
  )
}
