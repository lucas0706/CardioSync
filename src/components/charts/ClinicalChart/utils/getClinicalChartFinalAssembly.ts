export interface ClinicalChartFinalAssembly {
  data: boolean
  series: boolean
  interaction: boolean
  presentation: boolean
}

export function getClinicalChartFinalAssembly():
  ClinicalChartFinalAssembly {

  return {
    data: true,
    series: true,
    interaction: true,
    presentation: true,
  }
}
