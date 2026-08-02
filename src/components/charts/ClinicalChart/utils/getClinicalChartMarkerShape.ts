import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export type ClinicalMarkerShape =
  | 'square'
  | 'circle'
  | 'triangle'
  | 'diamond'

export function getClinicalChartMarkerShape(
  key: ClinicalSeriesKey,
): ClinicalMarkerShape {

  switch (key) {

    case 'systolic':
      return 'square'

    case 'diastolic':
      return 'circle'

    case 'heartRate':
      return 'triangle'

    case 'weight':
    case 'spo2':
      return 'diamond'

    default:
      return 'circle'
  }
}
