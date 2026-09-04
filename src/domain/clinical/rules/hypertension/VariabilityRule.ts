import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'
import type { ClinicalRule } from '../ClinicalRule'
import type { StatisticsSummary } from '@/domain/statistics/models/StatisticsSummary'

export interface VariabilityRuleInput {
  statistics: StatisticsSummary
}

/**
 * Evaluates blood pressure variability.
 *
 * This rule interprets calculated variability.
 */

export class VariabilityRule
  implements ClinicalRule<VariabilityRuleInput>
{
  evaluate(
    input: VariabilityRuleInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {
    const elevated =
      input.statistics.systolicVariability > 15 ||
      input.statistics.diastolicVariability > 10

    if (!elevated) {
      return []
    }

    return [
      {
        id: Crypto.randomUUID(),

        type: 'blood-pressure-variability',

        title:
          'Variabilidad elevada de presión arterial domiciliaria',

        description:
          'Se observa una fluctuación elevada de los valores de presión arterial registrados.',

        severity: 'moderate',

        guidelineId: context.guideline?.id,

        createdAt: new Date().toISOString(),
      },
    ]
  }
}
