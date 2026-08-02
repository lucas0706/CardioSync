import { useMemo } from 'react'

import {
  ClinicalChartDataPoint,
} from '../types/ClinicalChartData'

import {
  getClinicalChartExportData,
} from '../utils/getClinicalChartExportData'

export function useClinicalExport(
  data: ClinicalChartDataPoint[],
) {
  return useMemo(
    () =>
      getClinicalChartExportData(data),
    [data],
  )
}
