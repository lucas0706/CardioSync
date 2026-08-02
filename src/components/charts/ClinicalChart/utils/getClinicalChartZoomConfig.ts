export interface ClinicalZoomConfig {
  minScale: number
  maxScale: number
  step: number
}

export function getClinicalChartZoomConfig(
  mode: 'standard' | 'compact' | 'mapa',
): ClinicalZoomConfig {

  if (mode === 'mapa') {
    return {
      minScale: 1,
      maxScale: 8,
      step: 0.5,
    }
  }

  if (mode === 'compact') {
    return {
      minScale: 1,
      maxScale: 4,
      step: 0.5,
    }
  }

  return {
    minScale: 1,
    maxScale: 5,
    step: 0.5,
  }
}
