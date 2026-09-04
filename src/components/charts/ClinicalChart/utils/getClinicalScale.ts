import { ClinicalChartDataPoint } from '../types/ClinicalChartData'
import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalScale {
  min: number
  max: number
}

export function getClinicalScale(
  data: ClinicalChartDataPoint[],
  key: ClinicalSeriesKey,
): ClinicalScale {

  const values = data
    .map(item => item[key])
    .filter(
      (value): value is number =>
        typeof value === 'number',
    )

  if (values.length === 0) {
    return {
      min: 0,
      max: 100,
    }
  }

  const min =
    Math.min(...values)

  const max =
    Math.max(...values)

  const padding =
    Math.max(
      (max - min) * 0.15,
      5,
    )

  return {
    min: Math.floor(min - padding),
    max: Math.ceil(max + padding),
  }
}
