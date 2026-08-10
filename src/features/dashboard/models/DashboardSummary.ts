export interface DashboardSummary {
  totalMeasurements: number
  averageSystolic: number
  averageDiastolic: number
  averageHeartRate: number | null
  latestSystolic: number | null
  latestDiastolic: number | null
  latestDateTime: string | null
}
