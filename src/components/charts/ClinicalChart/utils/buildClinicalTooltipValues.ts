import { ClinicalSeries } from '../types/ClinicalSeries'
import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

import { getClinicalSymbol } from './getClinicalSymbols'

export function buildClinicalTooltipValues(
  point: ClinicalChartDataPoint,
  series: ClinicalSeries[],
) {
  return series.map(item => ({
    label: item.label,
    value: point[item.key] as number | undefined,
    unit: item.unit,
    color: item.color,
    symbol: getClinicalSymbol(item.key),
  }))
}
