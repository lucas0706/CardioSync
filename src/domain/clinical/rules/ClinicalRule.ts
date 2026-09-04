import type { ClinicalFinding } from '../models/ClinicalFinding'
import type { ClinicalRuleContext } from './ClinicalRuleContext'

/**
 * Contract for clinical interpretation rules.
 *
 * Rules transform available clinical information
 * into clinical findings.
 *
 * Rules do not mutate measurements.
 */

export interface ClinicalRule<TInput = unknown> {
  evaluate(
    input: TInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[]
}
