import { useMemo } from 'react'

import { ClinicalTarget } from '../types/ClinicalTarget'
import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export function useClinicalTargets(
  keys: ClinicalSeriesKey[],
): ClinicalTarget {

  return useMemo(
    () => ({
      systolic:
        keys.includes('systolic')
          ? 120
          : undefined,

      diastolic:
        keys.includes('diastolic')
          ? 80
          : undefined,
    }),
    [keys],
  )
}
