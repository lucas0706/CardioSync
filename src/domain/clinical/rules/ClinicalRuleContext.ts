import type { ClinicalGuideline } from '../models/ClinicalGuideline'
import type { ClinicalContext } from '../models/ClinicalContext'
import type { ClinicalResult } from '@/clinical/engine'

/**
 * Shared execution context for clinical rules.
 *
 * Provides traceability information
 * and common clinical inputs.
 */

export interface ClinicalRuleContext {
  guideline?: ClinicalGuideline

  clinicalResult?: ClinicalResult

  clinicalContext?: ClinicalContext

  evaluatedAt: string
}
