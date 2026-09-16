import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export function getClinicalChartMarkerSize(
  key: ClinicalSeriesKey,
  density: 'low' | 'medium' | 'high',
): number {

  if (density === 'high') {
    return 2
  }

  if (density === 'medium') {
    return 4
  }

  switch (key) {

    case 'systolic':
    case 'diastolic':
    case 'heartRate':
      return 6

    default:
      return 5
  }
}
