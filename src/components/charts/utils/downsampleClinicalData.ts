import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

const DEFAULT_LIMIT = 500

export function downsampleClinicalData(
  data: ClinicalChartDataPoint[],
  limit = DEFAULT_LIMIT,
): ClinicalChartDataPoint[] {
  if (data.length <= limit) {
    return data
  }

  const bucketSize =
    Math.ceil(data.length / limit)

  const result: ClinicalChartDataPoint[] = []

  for (
    let index = 0;
    index < data.length;
    index += bucketSize
  ) {
    const bucket = data.slice(
      index,
      index + bucketSize,
    )

    const maxSystolic = bucket.reduce(
      (max, item) =>
        item.systolic > max.systolic
          ? item
          : max,
      bucket[0],
    )

    const minDiastolic = bucket.reduce(
      (min, item) =>
        item.diastolic < min.diastolic
          ? item
          : min,
      bucket[0],
    )

    result.push(
      maxSystolic,
      minDiastolic,
    )
  }

  return result.sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  )
}
