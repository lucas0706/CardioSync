/**
 * Represents a therapeutic clinical target.
 *
 * Targets define recommended ranges according to
 * a clinical guideline and patient population.
 *
 * They do not execute clinical decisions.
 * Interpretation belongs to clinical rules.
 */

export interface ClinicalTarget {
  /**
   * Unique identifier.
   */
  id: string

  /**
   * Guideline source identifier.
   */
  guidelineId: string

  /**
   * Population where this target applies.
   */
  population: string

  /**
   * Systolic blood pressure target range.
   */
  systolic?: {
    min?: number
    max?: number
  }

  /**
   * Diastolic blood pressure target range.
   */
  diastolic?: {
    min?: number
    max?: number
  }

  /**
   * Conditions required to apply this target.
   */
  conditions?: string[]

  /**
   * Safety warnings.
   */
  warnings?: string[]

  /**
   * Recommendation class from guideline.
   */
  recommendationClass?: string

  /**
   * Evidence level from guideline.
   */
  evidenceLevel?: string

  /**
   * Human-readable description.
   */
  description?: string
}
