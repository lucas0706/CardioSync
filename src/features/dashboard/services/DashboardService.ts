import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { DashboardSummary } from '../models/DashboardSummary'

export class DashboardService {
  build(
    records: BloodPressureRecord[],
  ): DashboardSummary {

    if (records.length === 0) {
      return {
        totalMeasurements: 0,
        averageSystolic: 0,
        averageDiastolic: 0,
        averageHeartRate: null,
        latestSystolic: null,
        latestDiastolic: null,
    latestDateTime: null,
      }
    }

    const averageHeartRate =
      records
        .filter((r) => r.heartRate != null)
        .reduce(
          (sum, r) => sum + (r.heartRate ?? 0),
          0,
        )

    const heartRateCount =
      records.filter(
        (r) => r.heartRate != null,
      ).length

    return {
      totalMeasurements: records.length,

      averageSystolic: Math.round(
        records.reduce(
          (sum, r) => sum + r.systolic,
          0,
        ) / records.length,
      ),

      averageDiastolic: Math.round(
        records.reduce(
          (sum, r) => sum + r.diastolic,
          0,
        ) / records.length,
      ),

      averageHeartRate:
        heartRateCount === 0
          ? null
          : Math.round(
              averageHeartRate /
                heartRateCount,
            ),

      latestSystolic: records[0].systolic,

      latestDiastolic: records[0].diastolic,
  latestDateTime: records[0].dateTime,
    }
  }
}

export const dashboardService =
  new DashboardService()
