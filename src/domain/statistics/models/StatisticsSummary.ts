import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export interface StatisticsSummary {
  totalMeasurements: number

  averageSystolic: number
  averageDiastolic: number
  averageHeartRate?: number

  maximumSystolic?: number
  maximumDiastolic?: number

  minimumSystolic?: number
  minimumDiastolic?: number

  /** The record with the maximum systolic value; ties use earliest valid date, then ID. */
  maximumRecord?: BloodPressureRecord

  /** The record with the minimum systolic value; ties use earliest valid date, then ID. */
  minimumRecord?: BloodPressureRecord

  maximumSystolicRecord?: BloodPressureRecord
  maximumDiastolicRecord?: BloodPressureRecord
  minimumSystolicRecord?: BloodPressureRecord
  minimumDiastolicRecord?: BloodPressureRecord

  pulsePressureAverage: number

  meanArterialPressureAverage: number

  systolicStandardDeviation: number
  diastolicStandardDeviation: number

  systolicVariability: number
  diastolicVariability: number

  hypertensionLoad: number

  timeInTarget: number

  adherence?: number
  predominantClassification?: string

  classificationDistribution?: Record<string, number>
}
