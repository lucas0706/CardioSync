export interface ClinicalChartCompletionStatus {
  core: boolean
  architecture: boolean
  integration: boolean
  refinement: boolean
}

export function getClinicalChartCompletionStatus():
  ClinicalChartCompletionStatus {

  return {
    core: true,
    architecture: true,
    integration: false,
    refinement: false,
  }
}
