export interface ClinicalChartIntegrationChecklist {
  exported: boolean
  typed: boolean
  compiled: boolean
  readyForScreen: boolean
}

export function getClinicalChartIntegrationChecklist():
  ClinicalChartIntegrationChecklist {

  return {
    exported: true,
    typed: true,
    compiled: true,
    readyForScreen: false,
  }
}
