export interface ClinicalChartPerformance {
  enableDownsampling: boolean
  maxPoints: number
}

export function getClinicalChartPerformance(
  points: number,
): ClinicalChartPerformance {

  if (points > 1000) {
    return {
      enableDownsampling: true,
      maxPoints: 500,
    }
  }

  if (points > 500) {
    return {
      enableDownsampling: true,
      maxPoints: 750,
    }
  }

  return {
    enableDownsampling: false,
    maxPoints: points,
  }
}
