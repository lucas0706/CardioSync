import * as Crypto from 'expo-crypto'

import type { StatisticsSummary } from '@/domain/statistics/models/StatisticsSummary'

import type { ClinicalRule } from '../ClinicalRule'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'
import type { ClinicalFinding } from '../../models/ClinicalFinding'

/**
 * Evaluates home blood pressure control.
 *
 * This rule does not establish diagnosis.
 * It identifies elevated home blood pressure patterns
 * that require clinical interpretation.
 */

export interface HomeBloodPressureControlInput {
  statistics: StatisticsSummary
}

export class HomeBloodPressureControlRule
  implements ClinicalRule<HomeBloodPressureControlInput>
{
  evaluate(
    input: HomeBloodPressureControlInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {
    const { statistics } = input

    const elevated =
      statistics.averageSystolic >= 135 ||
      statistics.averageDiastolic >= 85

    if (!elevated) {
      return []
    }

    return [
      {
        id: Crypto.randomUUID(),

        type: 'home-blood-pressure',

        title:
          'Presión arterial domiciliaria promedio elevada',

        description:
          'El promedio de mediciones domiciliarias supera valores de referencia utilizados para seguimiento.',

        severity: 'moderate',

        guidelineId: context.guideline?.id,

        createdAt: new Date().toISOString(),
      },
    ]
  }
}
