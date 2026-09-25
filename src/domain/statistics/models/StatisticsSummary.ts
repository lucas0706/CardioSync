import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export interface StatisticsSummary {
  totalMeasurements: number

  averageSystolic: number
  averageDiastolic: number
  averageHeartRate?: number

  maximumSystolic: number
  maximumDiastolic: number

  minimumSystolic: number
  minimumDiastolic: number

  maximumRecord?: BloodPressureRecord

  minimumRecord?: BloodPressureRecord

  pulsePressureAverage: number

  meanArterialPressureAverage: number

  systolicStandardDeviation: number
  diastolicStandardDeviation: number

  systolicVariability: number
  diastolicVariability: number

  hypertensionLoad: number

  timeInTarget: number

  adherence: number

  trend: 'up' | 'down' | 'stable'

  predominantClassification?: string

  classificationDistribution?: Record<string, number>
}
