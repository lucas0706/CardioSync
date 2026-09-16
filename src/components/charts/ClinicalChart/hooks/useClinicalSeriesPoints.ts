import { useMemo } from 'react'

import { ClinicalSeries } from '../types/ClinicalSeries'

import { buildClinicalSeriesPoints } from '../utils/buildClinicalSeriesPoints'

export function useClinicalSeriesPoints(
  series: ClinicalSeries[],
) {
  return useMemo(
    () =>
      buildClinicalSeriesPoints(series),
    [series],
  )
}
