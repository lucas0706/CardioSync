export interface ClinicalEmptyState {
  title: string
  description: string
}

export function getClinicalChartEmptyState(
  hasRecords: boolean,
): ClinicalEmptyState | null {

  if (hasRecords) {
    return null
  }

  return {
    title: 'Sin datos clínicos',
    description:
      'No existen mediciones disponibles para visualizar.',
  }
}
