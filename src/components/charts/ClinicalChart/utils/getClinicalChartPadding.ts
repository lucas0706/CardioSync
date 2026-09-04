export interface ClinicalChartPadding {
  top: number
  right: number
  bottom: number
  left: number
}

export function getClinicalChartPadding(
  mode: 'standard' | 'compact' | 'mapa',
): ClinicalChartPadding {

  if (mode === 'mapa') {
    return {
      top: 24,
      right: 24,
      bottom: 48,
      left: 64,
    }
  }

  if (mode === 'compact') {
    return {
      top: 16,
      right: 16,
      bottom: 36,
      left: 52,
    }
  }

  return {
    top: 20,
    right: 20,
    bottom: 40,
    left: 56,
  }
}
