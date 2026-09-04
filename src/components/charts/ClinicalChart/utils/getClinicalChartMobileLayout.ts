export interface ClinicalMobileLayout {
  height: number
  horizontalPadding: number
  verticalPadding: number
}

export function getClinicalChartMobileLayout(
  width: number,
): ClinicalMobileLayout {

  if (width < 360) {
    return {
      height: 320,
      horizontalPadding: 12,
      verticalPadding: 16,
    }
  }

  if (width < 420) {
    return {
      height: 360,
      horizontalPadding: 16,
      verticalPadding: 20,
    }
  }

  return {
    height: 400,
    horizontalPadding: 20,
    verticalPadding: 24,
  }
}
