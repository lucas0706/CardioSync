export interface ClinicalChartReadyState {
  compiled: boolean
  architecture: boolean
  visualLayer: boolean
  integrationPending: boolean
}

export function getClinicalChartReadyState():
  ClinicalChartReadyState {

  return {
    compiled: true,
    architecture: true,
    visualLayer: true,
    integrationPending: true,
  }
}
