import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalMarkerStyle {
  shape: 'square' | 'circle' | 'triangle'
  size: number
}

export function getClinicalMarkerStyle(
  key: ClinicalSeriesKey,
): ClinicalMarkerStyle {

  switch (key) {

    case 'systolic':
      return {
        shape: 'square',
        size: 5,
      }

    case 'diastolic':
      return {
        shape: 'circle',
        size: 5,
      }

    case 'heartRate':
      return {
        shape: 'triangle',
        size: 5,
      }

    default:
      return {
        shape: 'circle',
        size: 4,
      }
  }
}
