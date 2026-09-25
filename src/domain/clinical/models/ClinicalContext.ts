/**
 * Clinical context associated with a patient.
 *
 * This model contains patient-level information that can influence
 * clinical interpretation but is not part of an individual measurement.
 *
 * ClinicalContext is intentionally separated from BloodPressureRecord.
 *
 * Profile V1 contains only manually entered information that belongs
 * to the stable clinical context of the user.
 *
 * Data supplied by Health Connect is intentionally kept outside this
 * model for now and will be integrated through a separate data source.
 */
export interface ClinicalContext {
  // Identity

  patientId: string

name?: string

  // Demographic information

  age?: number

  sex?: 'male' | 'female'

  // Anthropometric information

  height?: number

  /**
   * Initial/reference weight entered manually by the user.
   *
   * Current weight may later be supplied by Health Connect.
   */
  weight?: number

  /**
   * Derived from height and weight.
   *
   * This value is not entered manually by the user.
   */
  bmi?: number

  // Cardiovascular risk factors

  smoking?: boolean

  diabetes?: boolean

  dyslipidemia?: boolean

  // Cardiovascular conditions

  cardiovascularDisease?: boolean

  heartFailure?: boolean

  strokeHistory?: boolean

  peripheralVascularDisease?: boolean

  // Renal condition

  chronicKidneyDisease?: boolean
}
