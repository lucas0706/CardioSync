export interface ClinicalXAxisConfig {
  tickCount: number
  format: (value: string) => string
}

export function getClinicalChartXAxis(
  mode: 'standard' | 'compact' | 'mapa',
): ClinicalXAxisConfig {

  if (mode === 'mapa') {
    return {
      tickCount: 8,
      format: value =>
        new Date(value)
          .toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit',
            },
          ),
    }
  }

  if (mode === 'compact') {
    return {
      tickCount: 5,
      format: value =>
        new Date(value)
          .toLocaleDateString(),
    }
  }

  return {
    tickCount: 6,
    format: value =>
      new Date(value)
        .toLocaleDateString(),
  }
}
