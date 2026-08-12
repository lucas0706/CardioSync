import type { DashboardMetrics } from '@/domain/dashboard/DashboardMetrics'

import type { DashboardSummary } from '../models/DashboardSummary'

export class DashboardService {
  build(
    metrics: DashboardMetrics,
  ): DashboardSummary {
    return {
      averageSystolic:
        metrics.averageSystolic,

      averageDiastolic:
        metrics.averageDiastolic,

      averageHeartRate:
        metrics.averageHeartRate,

      latestSystolic:
        metrics.latestSystolic,

      latestDiastolic:
        metrics.latestDiastolic,

      latestDateTime:
        metrics.latestDateTime,
    }
  }
}

export const dashboardService =
  new DashboardService()
