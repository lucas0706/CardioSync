import * as Crypto from 'expo-crypto'

import {
  BloodPressureClassifier,
} from '../../classification'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRule } from '../ClinicalRule'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'

export interface BloodPressureClassificationRuleInput {
  averageSystolic: number
  averageDiastolic: number
}

export class BloodPressureClassificationRule
  implements ClinicalRule
{
  evaluate(
    input: BloodPressureClassificationRuleInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {
    const classification =
      BloodPressureClassifier.classify(
        input.averageSystolic,
        input.averageDiastolic,
      )

    return [
      {
        id: Crypto.randomUUID(),

        type: 'blood-pressure-classification',

        title: classification.label,

        description:
          `Clasificación de presión arterial: ${classification.label}.`,

        severity:
          classification.category === 'optimal' ||
          classification.category === 'normal'
            ? 'low'
            : 'moderate',

        guidelineId:
          context.guideline?.id,

        createdAt:
          new Date().toISOString(),
      },
    ]
  }
}
