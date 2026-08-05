import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'
import type { ClinicalRule } from '../ClinicalRule'
import type { StatisticsSummary } from '@/domain/statistics/models/StatisticsSummary'

export interface TimeInTargetRuleInput {
  statistics: StatisticsSummary
}

/**
 * Evaluates time spent within blood pressure target.
 *
 * This rule interprets calculated statistics.
 */

export class TimeInTargetRule
  implements ClinicalRule<TimeInTargetRuleInput>
{
  evaluate(
    input: TimeInTargetRuleInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {
    if (input.statistics.timeInTarget >= 50) {
      return []
    }

    return [
      {
        id: Crypto.randomUUID(),

        type: 'time-in-target',

        title:
          'Tiempo en objetivo de presión arterial reducido',

        description:
          'Una proporción baja de mediciones se encuentra dentro del rango objetivo configurado.',

        severity: 'moderate',

        guidelineId: context.guideline?.id,

        createdAt: new Date().toISOString(),
      },
    ]
  }
}
