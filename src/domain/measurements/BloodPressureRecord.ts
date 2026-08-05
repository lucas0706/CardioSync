import type { Arm } from './types/Arm'
import type { Position } from './types/Position'

/**
 * Aggregate Root representing a blood pressure measurement.
 *
 * Phase 5 note:
 * The properties are grouped by responsibility.
 * Clinical-context fields remain temporarily for compatibility and will be
 * extracted into ClinicalContext in a future roadmap phase.
 */
export interface BloodPressureRecord {
  // Identity

  id: string
  createdAt: string
  updatedAt: string

  // Core measurement

  dateTime: string

  systolic: number
  diastolic: number
  heartRate?: number

  // Measurement conditions

  arm?: Arm
  position?: Position

  notes?: string

  // Reserved for future ClinicalContext

  weight?: number
  height?: number
  bmi?: number

  glucose?: number
  spo2?: number
  temperature?: number
  respiratoryRate?: number

  pain?: number



  // Reserved for future clinical analysis

  guideline?: string
}
