/**
 * Clinical context associated with a patient.
 *
 * This model contains patient-level information that influences
 * clinical interpretation but is not part of an individual measurement.
 *
 * It is intentionally separated from BloodPressureRecord.
 */

export interface ClinicalContext {
  // Identity reference

  patientId: string

  // Cardiovascular risk factors

  smoking?: boolean

  diabetes?: boolean

  dyslipidemia?: boolean

  obesity?: boolean

  familyHistoryCardiovascularDisease?: boolean

  // Associated clinical conditions

  chronicKidneyDisease?: boolean

  cardiovascularDisease?: boolean

  heartFailure?: boolean

  strokeHistory?: boolean

  peripheralVascularDisease?: boolean

  // Special populations

    age?: number
  pregnancy?: boolean

  olderAdult?: boolean

  // Lifestyle context

  physicalActivityLevel?: string

  alcoholConsumption?: string

  dietaryPattern?: string

  // Additional extensibility

  notes?: string
}
