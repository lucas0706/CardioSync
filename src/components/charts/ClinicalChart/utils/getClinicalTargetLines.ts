import { ClinicalSeriesKey } from '../types/ClinicalSeries'
import { ClinicalTarget } from '../types/ClinicalTarget'

export function getClinicalTargetLines(
  keys: ClinicalSeriesKey[],
): ClinicalTarget {

  const enabled =
    keys.includes('systolic') ||
    keys.includes('diastolic')

  if (!enabled) {
    return {}
  }

  return {
    systolic: 120,
    diastolic: 80,
  }
}
