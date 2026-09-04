export function getClinicalMapaMode(
  points: number,
): 'standard' | 'compact' | 'mapa' {

  if (points >= 300) {
    return 'mapa'
  }

  if (points >= 100) {
    return 'compact'
  }

  return 'standard'
}
