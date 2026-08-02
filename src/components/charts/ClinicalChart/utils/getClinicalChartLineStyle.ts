import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalLineStyle {
  width: number
  dashed: boolean
}

export function getClinicalChartLineStyle(
  key: ClinicalSeriesKey,
): ClinicalLineStyle {

  switch (key) {

    case 'systolic':
    case 'diastolic':
      return {
        width: 3,
        dashed: false,
      }

    case 'heartRate':
      return {
        width: 2,
        dashed: false,
      }

    default:
      return {
        width: 2,
        dashed: false,
      }
  }
}
