import { useMemo } from 'react'

import {
  getClinicalChartIntegrationChecklist,
} from '../utils/getClinicalChartIntegrationChecklist'

export function useClinicalChartIntegrationChecklist() {

  return useMemo(
    () =>
      getClinicalChartIntegrationChecklist(),
    [],
  )
}
