import type { ClinicalGuideline } from '../models/ClinicalGuideline'
import type { ClinicalContext } from '../models/ClinicalContext'

/**
 * Shared execution context for clinical rules.
 *
 * Provides traceability information
 * and common clinical inputs.
 */
export interface ClinicalRuleContext {
  guideline?: ClinicalGuideline

  clinicalContext?: ClinicalContext

  evaluatedAt: string
}
