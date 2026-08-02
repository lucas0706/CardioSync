export interface ClinicalChartAccessibility {
  label: string
  description: string
}

export function getClinicalChartAccessibility(
  variables: string[],
): ClinicalChartAccessibility {

  return {
    label:
      'Gráfico clínico de evolución',

    description:
      `Visualización de ${variables.length} variables clínicas`,
  }
}
