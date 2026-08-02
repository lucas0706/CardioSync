export interface ClinicalChartDataPoint
  extends Record<string, unknown> {
  date: string

  systolic: number

  diastolic: number

  heartRate?: number

  weight?: number

  glucose?: number

  spo2?: number

  temperature?: number

  respiratoryRate?: number
}
