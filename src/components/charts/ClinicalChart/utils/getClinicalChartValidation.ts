import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

export interface ClinicalChartValidation {
  valid: boolean
  reason?: string
}

export function getClinicalChartValidation(
  data: ClinicalChartDataPoint[],
): ClinicalChartValidation {

  if (!data.length) {
    return {
      valid: false,
      reason:
        'No clinical data available',
    }
  }

  return {
    valid: true,
  }
}
