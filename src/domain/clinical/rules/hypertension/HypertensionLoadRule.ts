import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'
import type { ClinicalRule } from '../ClinicalRule'
import type { StatisticsSummary } from '@/domain/statistics/models/StatisticsSummary'

export interface HypertensionLoadRuleInput {
  statistics: StatisticsSummary
}

/**
 * Evaluates hypertension load from existing statistics.
 *
 * This rule interprets calculated data.
 * It does not calculate the load.
 */

export class HypertensionLoadRule
  implements ClinicalRule<HypertensionLoadRuleInput>
{
  evaluate(
    input: HypertensionLoadRuleInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {
    if (input.statistics.hypertensionLoad <= 0) {
      return []
    }

    return [
      {
        id: Crypto.randomUUID(),

        type: 'hypertension-load',

        title:
          'Carga elevada de mediciones de presión arterial',

        description:
          'Existe una proporción relevante de mediciones domiciliarias fuera del rango esperado.',

        severity: 'moderate',

        guidelineId: context.guideline?.id,

        createdAt: new Date().toISOString(),
      },
    ]
  }
}
