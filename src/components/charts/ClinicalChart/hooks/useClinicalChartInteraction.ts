import { useMemo } from 'react'

import {
  defaultClinicalChartInteraction,
} from '../types/ClinicalChartInteraction'

export function useClinicalChartInteraction() {
  return useMemo(
    () =>
      defaultClinicalChartInteraction,
    [],
  )
}
