import type { StatisticsSummary } from '../../statistics/models/StatisticsSummary'
import type { ClinicalFinding } from './ClinicalFinding'

/**
 * Structured representation of a Clinical Analysis.
 *
 * This model organizes the existing ClinicalFinding[] output
 * without replacing the original findings collection.
 *
 * ClinicalAnalysisResult does not calculate statistics
 * and does not perform clinical interpretation itself.
 */
export interface ClinicalAnalysisResult {
  classification: ClinicalFinding[]

  trends: ClinicalFinding[]

  targets: ClinicalFinding[]

  control: ClinicalFinding[]

  load: ClinicalFinding[]

  variability: ClinicalFinding[]

  safety: ClinicalFinding[]

  risk: ClinicalFinding[]

  metrics?: StatisticsSummary
}
