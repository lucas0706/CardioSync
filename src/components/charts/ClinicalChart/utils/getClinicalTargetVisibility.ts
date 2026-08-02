import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalTargetVisibility {
  systolic: boolean
  diastolic: boolean
}

export function getClinicalTargetVisibility(
  activeSeries: ClinicalSeriesKey[],
): ClinicalTargetVisibility {

  const hasPressure =
    activeSeries.includes('systolic') ||
    activeSeries.includes('diastolic')

  return {
    systolic: hasPressure,
    diastolic: hasPressure,
  }
}
