import type { BloodPressureRecord } from '../../measurements/BloodPressureRecord'
import type { StatisticsSummary } from '../../statistics/models/StatisticsSummary'
import type { ClinicalAnalysis } from '../models/ClinicalAnalysis'
import type { ClinicalContext } from '../models/ClinicalContext'
import type { ClinicalGuideline } from '../models/ClinicalGuideline'
import type { ClinicalResult } from '@/clinical/engine'

/**
 * Service responsible for clinical interpretation.
 *
 * This service does not calculate statistics.
 * It consumes existing measurements, statistical summaries,
 * clinical context and guidelines.
 */

export interface ClinicalAnalysisInput {
  measurements: BloodPressureRecord[]

  statistics?: StatisticsSummary

  clinicalResult?: ClinicalResult

  context: ClinicalContext

  guideline?: ClinicalGuideline
}

export interface ClinicalAnalysisService {
  analyze(input: ClinicalAnalysisInput): ClinicalAnalysis
}
