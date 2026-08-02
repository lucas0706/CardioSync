import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export function getClinicalChartAccessibilityLabel(
  keys: ClinicalSeriesKey[],
): string {

  if (!keys.length) {
    return 'Gráfico clínico sin variables activas'
  }

  return (
    'Gráfico clínico con variables: ' +
    keys.join(', ')
  )
}
