import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

export interface ClinicalDataRange {
  start?: string
  end?: string
  days: number
}

export function getClinicalChartDataRange(
  data: ClinicalChartDataPoint[],
): ClinicalDataRange {

  if (!data.length) {
    return {
      days: 0,
    }
  }

  const start =
    new Date(
      data[0].date,
    )

  const end =
    new Date(
      data[data.length - 1].date,
    )

  const diff =
    end.getTime() -
    start.getTime()

  return {
    start:
      data[0].date,

    end:
      data[data.length - 1].date,

    days:
      Math.ceil(
        diff /
        (1000 * 60 * 60 * 24),
      ),
  }
}
