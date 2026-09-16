import { ClinicalSeries } from '../types/ClinicalSeries'

import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

export interface ClinicalPointConfig {
  key: string
  color: string
  symbol: string
}

export function buildClinicalSeriesPoints(
  series: ClinicalSeries[],
): ClinicalPointConfig[] {

  return series.map(item => ({
    key: item.key,
    color: item.color,
    symbol: item.symbol,
  }))
}
