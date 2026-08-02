import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalStrokeConfig {
  width: number
  opacity: number
}

export function getClinicalChartStroke(
  key: ClinicalSeriesKey,
): ClinicalStrokeConfig {

  switch (key) {

    case 'systolic':
    case 'diastolic':
      return {
        width: 3,
        opacity: 1,
      }

    case 'heartRate':
      return {
        width: 2.5,
        opacity: 0.95,
      }

    default:
      return {
        width: 2,
        opacity: 0.9,
      }
  }
}
