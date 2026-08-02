export interface ClinicalPointDensity {
  radius: number
  strokeWidth: number
}

export function getClinicalChartPointDensity(
  count: number,
): ClinicalPointDensity {

  if (count > 1000) {
    return {
      radius: 2,
      strokeWidth: 1.5,
    }
  }

  if (count > 300) {
    return {
      radius: 3,
      strokeWidth: 2,
    }
  }

  return {
    radius: 5,
    strokeWidth: 2.5,
  }
}
