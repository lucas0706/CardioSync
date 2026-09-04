import {
  ClinicalChartDataPoint,
} from '../types/ClinicalChartData'

const DEFAULT_LIMIT = 500

export function downsampleClinicalData(
  data: ClinicalChartDataPoint[],
  limit = DEFAULT_LIMIT,
): ClinicalChartDataPoint[] {
  if (data.length <= limit) {
    return data
  }

  const bucketSize =
    Math.ceil(
      data.length / limit,
    )

  const result: ClinicalChartDataPoint[] = []

  for (
    let i = 0;
    i < data.length;
    i += bucketSize
  ) {
    const bucket =
      data.slice(
        i,
        i + bucketSize,
      )

    if (bucket.length === 0) {
      continue
    }

    const selected =
      bucket.reduce(
        (best, current) => {
          const bestTime =
            new Date(
              best.date,
            ).getTime()

          const currentTime =
            new Date(
              current.date,
            ).getTime()

          return currentTime >
            bestTime
            ? current
            : best
        },
        bucket[0],
      )

    result.push(selected)
  }

  return result.sort(
    (a, b) =>
      new Date(
        a.date,
      ).getTime() -
      new Date(
        b.date,
      ).getTime(),
  )
}
