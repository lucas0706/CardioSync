import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'
import type { ClinicalRule } from '../ClinicalRule'
import type { StatisticsSummary } from '@/domain/statistics/models/StatisticsSummary'

export interface TrendRuleInput {
  statistics: StatisticsSummary
}

/**
 * Evaluates home blood pressure trend.
 *
 * This rule interprets statistical output.
 * It does not calculate trends.
 */

export class TrendRule
  implements ClinicalRule<TrendRuleInput>
{
  evaluate(
    input: TrendRuleInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {
    if (input.statistics.trend !== 'up') {
      return []
    }

    return [
      {
        id: Crypto.randomUUID(),

        type: 'home-blood-pressure-trend',

        title:
          'Tendencia ascendente de presión arterial domiciliaria',

        description:
          'Se observa una tendencia creciente en los valores de presión arterial domiciliaria.',

        severity: 'moderate',

        guidelineId: context.guideline?.id,

        createdAt: new Date().toISOString(),
      },
    ]
  }
}
