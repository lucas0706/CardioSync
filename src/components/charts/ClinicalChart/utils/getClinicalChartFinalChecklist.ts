export interface ClinicalChartChecklist {
  architecture: boolean
  typescript: boolean
  dataPipeline: boolean
  visualization: boolean
}

export function getClinicalChartFinalChecklist(): ClinicalChartChecklist {

  return {
    architecture: true,
    typescript: true,
    dataPipeline: true,
    visualization: true,
  }
}
