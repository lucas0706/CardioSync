import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

const DEFAULT_LIMIT = 500

export function downsampleClinicalData(
  data: ClinicalChartDataPoint[],
  limit = DEFAULT_LIMIT,
): ClinicalChartDataPoint[] {
  if (data.length <= limit) {
    return data
  }

  const bucketSize = Math.ceil(data.length / limit)
  const result: ClinicalChartDataPoint[] = []

  for (let i = 0; i < data.length; i += bucketSize) {
    const bucket = data.slice(i, i + bucketSize)

    result.push(
      bucket.reduce(
        (a, b) =>
          (b.systolic ?? 0) > (a.systolic ?? 0)
            ? b
            : a,
        bucket[0],
      ),
    )
  }

  return result.sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  )
}
