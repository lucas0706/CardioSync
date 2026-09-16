import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

export interface ClinicalChartMetrics {
  points: number
  variables: number
}

export function getClinicalChartMetrics(
  data: ClinicalChartDataPoint[],
): ClinicalChartMetrics {

  const first =
    data[0]

  if (!first) {
    return {
      points: 0,
      variables: 0,
    }
  }

  const variables =
    Object.keys(first)
      .filter(
        key =>
          key !== 'date',
      )
      .length

  return {
    points:
      data.length,

    variables,
  }
}
