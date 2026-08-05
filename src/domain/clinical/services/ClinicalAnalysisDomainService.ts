import * as Crypto from 'expo-crypto'

import type { ClinicalAnalysis } from '../models/ClinicalAnalysis'
import { ConsensoArgentinaHTA2025 } from '../guidelines'
import type { ClinicalRule } from '../rules/ClinicalRule'
import type { ClinicalRuleContext } from '../rules/ClinicalRuleContext'
import {
  HomeBloodPressureControlRule,
  TrendRule,
  HypertensionLoadRule,
  TimeInTargetRule,
  VariabilityRule,
  ClinicalClassificationRule,
} from '../rules/hypertension'

import type {
  ClinicalAnalysisInput,
  ClinicalAnalysisService,
} from './ClinicalAnalysisService'

/**
 * Initial domain implementation for clinical analysis.
 *
 * Clinical rules are executed through composition.
 */

export class ClinicalAnalysisDomainService
  implements ClinicalAnalysisService
{
  private readonly rules: ClinicalRule[] = [
    new HomeBloodPressureControlRule(),
    new TrendRule(),
    new HypertensionLoadRule(),
    new TimeInTargetRule(),
    new VariabilityRule(),
    new ClinicalClassificationRule(),
  ]

  analyze(input: ClinicalAnalysisInput): ClinicalAnalysis {
    const context: ClinicalRuleContext = {
      guideline:
        input.guideline ?? ConsensoArgentinaHTA2025,

      clinicalResult:
        input.clinicalResult,

      evaluatedAt: new Date().toISOString(),
    }

    const findings = input.statistics
      ? this.rules.flatMap((rule) =>
          rule.evaluate(
            {
              statistics: input.statistics,
            },
            context,
          ),
        )
      : []

    return {
      id: Crypto.randomUUID(),

      patientId: input.context.patientId,

      createdAt: new Date().toISOString(),

      guideline:
        input.guideline ?? ConsensoArgentinaHTA2025,

      statistics: input.statistics,

      findings,

      summary:
        findings.length > 0
          ? 'Clinical findings generated.'
          : 'No clinical findings detected.',
    }
  }
}
