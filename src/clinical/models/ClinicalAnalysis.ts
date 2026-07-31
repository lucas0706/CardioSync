export interface ClinicalAnalysis {
  classification: string

  color: string

  guideline: string

  severity: number

  urgent: boolean

  recommendation: string

  targetSystolic?: number

  targetDiastolic?: number
}
