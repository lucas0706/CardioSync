export type ClinicalResponsiveMode =
  | 'mobile'
  | 'tablet'
  | 'desktop'

export function getClinicalChartResponsiveMode(
  width: number,
): ClinicalResponsiveMode {

  if (width < 420) {
    return 'mobile'
  }

  if (width < 900) {
    return 'tablet'
  }

  return 'desktop'
}
