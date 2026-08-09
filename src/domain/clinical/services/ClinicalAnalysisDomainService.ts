import * as Crypto from 'expo-crypto'

import type { ClinicalAnalysis } from '../models/ClinicalAnalysis'
import { ConsensoArgentinaHTA2025 } from '../guidelines'
import type { ClinicalRule } from '../rules/ClinicalRule'
import type { ClinicalRuleContext } from '../rules/ClinicalRuleContext'

import {
  BloodPressureSafetyRule,
BloodPressureClassificationRule,
} from '../rules'
import {
  HomeBloodPressureControlRule,
  TrendRule,
  HypertensionLoadRule,
  TimeInTargetRule,
  VariabilityRule,
  ClinicalClassificationRule,
TherapeuticTargetRule,
} from '../rules/hypertension'

import {
  CardiovascularRiskRule,
} from '../rules/cardiovascular'

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
    new TherapeuticTargetRule(),
    new CardiovascularRiskRule(),
    new BloodPressureSafetyRule(),
new BloodPressureClassificationRule(),
  ]

  analyze(input: ClinicalAnalysisInput): ClinicalAnalysis {
    const context: ClinicalRuleContext = {
      guideline:
        input.guideline ?? ConsensoArgentinaHTA2025,

      clinicalResult:
        input.clinicalResult,

      clinicalContext:
        input.context,

      evaluatedAt: new Date().toISOString(),
    }

      const findings = this.rules.flatMap((rule) => {

          if (
            rule instanceof BloodPressureSafetyRule ||
            rule instanceof BloodPressureClassificationRule
          ) {
            if (!input.statistics) {
              return []
            }

            return rule.evaluate(
              {
                averageSystolic:
                  input.statistics.averageSystolic,

                averageDiastolic:
                  input.statistics.averageDiastolic,
              },
              context,
            )
          }

        if (
          rule instanceof CardiovascularRiskRule ||
          rule instanceof TherapeuticTargetRule
        ) {
          if (!input.statistics) {
            return []
          }

          return rule.evaluate(
            {
              statistics: input.statistics,
              clinicalContext: input.context,
            },
            context,
          )
        }

        return rule.evaluate(
          {
            statistics: input.statistics,
          },
          context,
        )
      })

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
