import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalMarkerGeometry {
  radius: number
  sides: number
}

export function getClinicalMarkerGeometry(
  key: ClinicalSeriesKey,
): ClinicalMarkerGeometry {

  switch (key) {

    case 'systolic':
      return {
        radius: 5,
        sides: 4,
      }

    case 'diastolic':
      return {
        radius: 5,
        sides: 0,
      }

    case 'heartRate':
      return {
        radius: 5,
        sides: 3,
      }

    default:
      return {
        radius: 4,
        sides: 0,
      }
  }
}
