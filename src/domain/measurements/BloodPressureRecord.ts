/**
 * Aggregate Root representing a blood pressure measurement.
 *
 * Phase 5 note:
 * The properties are grouped by responsibility.
 * Clinical-context fields remain temporarily for compatibility and will be
 * extracted into ClinicalContext in a future roadmap phase.
 */
export interface BloodPressureRecord {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  id: string

  createdAt: string

  updatedAt: string

  // ---------------------------------------------------------------------------
  // Measurement
  // ---------------------------------------------------------------------------

  dateTime: string

  systolic: number

  diastolic: number

  heartRate?: number

  // ---------------------------------------------------------------------------
  // Measurement Conditions
  // ---------------------------------------------------------------------------

  arm?: 'left' | 'right'

  position?: 'sitting' | 'standing' | 'lying'

  device?: string

  cuffSize?: 'small' | 'medium' | 'large'

  notes?: string

  // ---------------------------------------------------------------------------
  // Reserved for future ClinicalContext
  // ---------------------------------------------------------------------------

  weight?: number

  height?: number

  bmi?: number

  glucose?: number

  spo2?: number

  temperature?: number

  respiratoryRate?: number

  pain?: number

  context?: string

  symptoms?: string

  medicationTaken?: boolean

  medicationName?: string

  medicationIds?: string[]

  // ---------------------------------------------------------------------------
  // Reserved for future clinical analysis
  // ---------------------------------------------------------------------------

  guideline?: string
}
