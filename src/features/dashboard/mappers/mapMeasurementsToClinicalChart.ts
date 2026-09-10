import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import type {
  ClinicalChartDataPoint,
} from '@/components/charts/ClinicalChart/types/ClinicalChartData'

export function mapMeasurementsToClinicalChart(
  measurements: BloodPressureRecord[],
): ClinicalChartDataPoint[] {

  return measurements
    .slice()
    .sort(
      (a, b) =>
        new Date(a.dateTime).getTime() -
        new Date(b.dateTime).getTime(),
    )
    .map(
      measurement => ({
        date:
          measurement.dateTime,

        systolic:
          measurement.systolic,

        diastolic:
          measurement.diastolic,

        heartRate:
          measurement.heartRate,

        weight:
          measurement.weight,

        glucose:
          measurement.glucose,

        spo2:
          measurement.spo2,

        temperature:
          measurement.temperature,

        respiratoryRate:
          measurement.respiratoryRate,
      }),
    )
}
