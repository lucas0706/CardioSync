import { ClinicalChartDataPoint } from '../types/ClinicalChartData'
import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalChartSummary {
  firstDate?: string
  lastDate?: string
  count: number
  activeSeries: ClinicalSeriesKey[]
}

export function getClinicalChartSummary(
  data: ClinicalChartDataPoint[],
  keys: ClinicalSeriesKey[],
): ClinicalChartSummary {

  return {
    firstDate:
      data[0]?.date,

    lastDate:
      data[data.length - 1]?.date,

    count:
      data.length,

    activeSeries:
      keys,
  }
}
