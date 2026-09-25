import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalYAxisConfig {
  min?: number
  max?: number
  tickCount: number
  format: (value: number) => string
}

export function getClinicalYAxisConfig(
  keys: ClinicalSeriesKey[],
): ClinicalYAxisConfig {

  const hasPressure =
    keys.includes('systolic') ||
    keys.includes('diastolic')

  if (hasPressure) {
    return {
      min: 40,
      max: 220,
      tickCount: 7,
      format: value => `${value} mmHg`,
    }
  }

  const hasHeartRate =
    keys.includes('heartRate')

  if (hasHeartRate) {
    return {
      min: 40,
      max: 180,
      tickCount: 8,
      format: value => `${value} lpm`,
    }
  }

  return {
    tickCount: 6,
    format: value => `${value}`,
  }
}
