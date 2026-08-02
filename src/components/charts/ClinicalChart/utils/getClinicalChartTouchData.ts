export interface ClinicalTouchData {
  active: boolean
  index?: number
}

export function getClinicalChartTouchData(
  active: boolean,
  index?: number,
): ClinicalTouchData {

  return {
    active,
    index,
  }
}
