import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export type DailyChartRecord = {
  dateTime: string
  systolic: number
  diastolic: number
  heartRate?: number
}

function getLocalDateKey(
  dateTime: string,
): string {
  const date = new Date(dateTime)

  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function average(
  values: number[],
): number {
  if (values.length === 0) {
    return 0
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length
  )
}

export function aggregateMeasurementsForChart(
  records: BloodPressureRecord[],
): DailyChartRecord[] {
  const groups = new Map<
    string,
    BloodPressureRecord[]
  >()

  const sortedRecords = [...records].sort(
    (a, b) =>
      new Date(a.dateTime).getTime() -
      new Date(b.dateTime).getTime(),
  )

  for (const record of sortedRecords) {
    const key = getLocalDateKey(
      record.dateTime,
    )

    const current =
      groups.get(key) ?? []

    current.push(record)
    groups.set(key, current)
  }

  return Array.from(groups.entries())
    .map(([dateKey, dayRecords]) => {
      const heartRates = dayRecords
        .map(record => record.heartRate)
        .filter(
          (value): value is number =>
            value !== undefined,
        )

      const firstRecord =
        dayRecords[0]

      return {
        dateTime: firstRecord.dateTime,
        systolic: Math.round(
          average(
            dayRecords.map(
              record => record.systolic,
            ),
          ),
        ),
        diastolic: Math.round(
          average(
            dayRecords.map(
              record => record.diastolic,
            ),
          ),
        ),
        ...(heartRates.length > 0
          ? {
              heartRate: Math.round(
                average(heartRates),
              ),
            }
          : {}),
      }
    })
    .sort(
      (a, b) =>
        new Date(a.dateTime).getTime() -
        new Date(b.dateTime).getTime(),
    )
}
