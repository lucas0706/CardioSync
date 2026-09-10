import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalChartRenderConfig {
  showTargets: boolean
  showHeartRate: boolean
  showPressure: boolean
  activeKeys: ClinicalSeriesKey[]
}

export function getClinicalChartRenderConfig(
  keys: ClinicalSeriesKey[],
): ClinicalChartRenderConfig {

  const showPressure =
    keys.includes('systolic') ||
    keys.includes('diastolic')

  return {
    showTargets: showPressure,

    showHeartRate:
      keys.includes('heartRate'),

    showPressure,

    activeKeys:
      keys,
  }
}
