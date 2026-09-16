import { useMemo } from 'react'

import { ClinicalSeriesKey } from '../types/ClinicalSeries'
import { getClinicalTargetLines } from '../utils/getClinicalTargetLines'

export function useClinicalTargetLines(
  keys: ClinicalSeriesKey[],
) {
  return useMemo(
    () =>
      getClinicalTargetLines(keys),
    [keys],
  )
}
