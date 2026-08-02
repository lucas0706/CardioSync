import { useMemo } from 'react'

import { getClinicalMapaMode } from '../utils/getClinicalMapaMode'

export function useClinicalMapMode(
  points: number,
) {
  return useMemo(
    () => getClinicalMapaMode(points),
    [points],
  )
}
