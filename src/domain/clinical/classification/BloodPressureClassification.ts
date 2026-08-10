export type BloodPressureCategory =
  | 'optimal'
  | 'normal'
  | 'high-normal'
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'isolated-systolic'

export type BloodPressureSafetyWarning =
  | 'low-diastolic'

export interface BloodPressureClassification {
  category: BloodPressureCategory
  label: string
  color: string
}

export interface BloodPressureClassificationResult
  extends BloodPressureClassification {
  systolic: number
  diastolic: number
  safetyWarnings: BloodPressureSafetyWarning[]
}
