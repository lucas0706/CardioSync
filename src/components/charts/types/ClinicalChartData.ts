export interface ClinicalChartDataPoint
  extends Record<string, unknown> {
  date: string

  systolic: number

  diastolic: number
}
