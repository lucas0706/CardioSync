export interface ClinicalChartInteraction {
  zoomEnabled: boolean
  panEnabled: boolean
  tooltipEnabled: boolean
}

export const defaultClinicalChartInteraction:
  ClinicalChartInteraction = {
    zoomEnabled: true,
    panEnabled: true,
    tooltipEnabled: true,
  }
