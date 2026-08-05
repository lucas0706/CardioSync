import type { ClinicalGuideline } from '../models/ClinicalGuideline'

/**
 * Shared execution context for clinical rules.
 *
 * Provides traceability information
 * for clinical knowledge execution.
 */

export interface ClinicalRuleContext {
  guideline?: ClinicalGuideline

  evaluatedAt: string
}
