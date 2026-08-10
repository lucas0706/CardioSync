/**
 * Clinical context associated with a patient.
 *
 * This model contains patient-level information that can influence
 * clinical interpretation but is not part of an individual measurement.
 *
 * ClinicalContext is intentionally separated from BloodPressureRecord.
 *
 * The model may contain information entered manually through the
 * future Profile feature and can later be enriched by other data sources.
 */
export interface ClinicalContext {
  // Identity reference

  patientId: string

  // Demographic information

  age?: number

  sex?: 'male' | 'female'

  // Anthropometric information

  height?: number

  weight?: number

  bmi?: number

  // Cardiovascular risk factors

  smoking?: boolean

  diabetes?: boolean

  dyslipidemia?: boolean

  obesity?: boolean

  familyHistoryCardiovascularDisease?: boolean

  // Cardiovascular conditions

  cardiovascularDisease?: boolean

  heartFailure?: boolean

  strokeHistory?: boolean

  peripheralVascularDisease?: boolean

  // Renal and other relevant conditions

  chronicKidneyDisease?: boolean

  // Special populations

  pregnancy?: boolean

  olderAdult?: boolean

  // Lifestyle context

  physicalActivityLevel?: string

  alcoholConsumption?: string

  dietaryPattern?: string

  // Additional extensibility

  notes?: string
}
