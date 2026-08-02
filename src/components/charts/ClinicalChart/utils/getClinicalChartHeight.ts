export function getClinicalChartHeight(
  mode: 'standard' | 'compact' | 'mapa',
): number {

  switch (mode) {

    case 'mapa':
      return 440

    case 'compact':
      return 300

    default:
      return 360
  }
}
