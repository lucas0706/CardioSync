import type { ClinicalRiskLevel } from '../types/ClinicalRiskLevel'

/**
 * Represents a clinical finding produced by clinical interpretation.
 *
 * Findings are not raw measurements.
 * They are conclusions generated from measurements,
 * context and clinical guidelines.
 */

export interface ClinicalFinding {
  // Identity

  id: string

  // Finding classification

  type: string

  title: string

  description?: string

  // Clinical relevance

  severity?: ClinicalRiskLevel

  // Traceability

  guidelineId?: string

  createdAt: string
}
