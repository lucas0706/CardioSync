import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRule } from '../ClinicalRule'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'

import type { ClinicalContext } from '../../models/ClinicalContext'
import type { ClinicalRiskLevel } from '../../types/ClinicalRiskLevel'

export interface CardiovascularRiskRuleInput {
  clinicalContext: ClinicalContext
}

export class CardiovascularRiskRule
  implements ClinicalRule<CardiovascularRiskRuleInput>
{
  evaluate(
    input: CardiovascularRiskRuleInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {
    const {
      cardiovascularDisease,
      heartFailure,
      strokeHistory,
      peripheralVascularDisease,
      chronicKidneyDisease,
      diabetes,
    } = input.clinicalContext

    let severity: ClinicalRiskLevel | undefined

    if (
      cardiovascularDisease ||
      heartFailure ||
      strokeHistory ||
      peripheralVascularDisease
    ) {
      severity = 'very-high'
    } else if (
      chronicKidneyDisease ||
      diabetes
    ) {
      severity = 'high'
    }

    if (!severity) {
      return []
    }

    return [
      {
        id: Crypto.randomUUID(),

        type: 'cardiovascular-risk',

        title:
          'Factores clínicos asociados a riesgo cardiovascular aumentado',

        description:
          'Se identificaron antecedentes clínicos que requieren consideración en la interpretación cardiovascular.',

        severity,

        guidelineId:
          context.guideline?.id,

        createdAt:
          new Date().toISOString(),
      },
    ]
  }
}
