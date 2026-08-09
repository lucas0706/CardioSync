import type { StatisticsSummary } from '../../statistics/models/StatisticsSummary'
import type { ClinicalFinding } from '../models/ClinicalFinding'
import type { ClinicalAnalysisResult } from '../models/ClinicalAnalysisResult'

const CLASSIFICATION_TYPES = new Set([
  'blood-pressure-classification',
])

const TREND_TYPES = new Set([
  'home-blood-pressure-trend',
])

const TARGET_TYPES = new Set([
  'therapeutic-target',
  'time-in-target',
])

const CONTROL_TYPES = new Set([
  'home-blood-pressure',
])

const LOAD_TYPES = new Set([
  'hypertension-load',
])

const VARIABILITY_TYPES = new Set([
  'blood-pressure-variability',
])

const SAFETY_TYPES = new Set([
  'safety-warning',
])

const RISK_TYPES = new Set([
  'cardiovascular-risk',
])

/**
 * Organizes existing ClinicalFinding[] into ClinicalAnalysisResult.
 *
 * This builder does not create findings and does not perform
 * clinical interpretation.
 */
export function buildClinicalAnalysisResult(
  findings: ClinicalFinding[],
  statistics?: StatisticsSummary,
): ClinicalAnalysisResult {
  const classification: ClinicalFinding[] = []
  const trends: ClinicalFinding[] = []
  const targets: ClinicalFinding[] = []
  const control: ClinicalFinding[] = []
  const load: ClinicalFinding[] = []
  const variability: ClinicalFinding[] = []
  const safety: ClinicalFinding[] = []
  const risk: ClinicalFinding[] = []

  for (const finding of findings) {
    if (CLASSIFICATION_TYPES.has(finding.type)) {
      classification.push(finding)
      continue
    }

    if (TREND_TYPES.has(finding.type)) {
      trends.push(finding)
      continue
    }

    if (TARGET_TYPES.has(finding.type)) {
      targets.push(finding)
      continue
    }

    if (CONTROL_TYPES.has(finding.type)) {
      control.push(finding)
      continue
    }

    if (LOAD_TYPES.has(finding.type)) {
      load.push(finding)
      continue
    }

    if (VARIABILITY_TYPES.has(finding.type)) {
      variability.push(finding)
      continue
    }

    if (SAFETY_TYPES.has(finding.type)) {
      safety.push(finding)
      continue
    }

    if (RISK_TYPES.has(finding.type)) {
      risk.push(finding)
      continue
    }

    // Preserve forward compatibility.
    // Unknown future findings remain visible.
    safety.push(finding)
  }

  return {
    classification,
    trends,
    targets,
    control,
    load,
    variability,
    safety,
    risk,
    metrics: statistics,
  }
}
