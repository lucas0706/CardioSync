export type ClinicalChartMode =
  | 'bloodPressure'
  | 'multiVariable'

export function getClinicalChartMode(
  keys: string[],
): ClinicalChartMode {

  const hasPressure =
    keys.includes('systolic') ||
    keys.includes('diastolic')

  return hasPressure
    ? 'bloodPressure'
    : 'multiVariable'
}
