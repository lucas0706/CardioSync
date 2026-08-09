import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRule } from '../ClinicalRule'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'

export interface BloodPressureClassificationRuleInput {
  averageSystolic: number
  averageDiastolic: number
}

export class BloodPressureClassificationRule
implements ClinicalRule {

  evaluate(
    input: BloodPressureClassificationRuleInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {

    const findings: ClinicalFinding[] = []

    const systolic =
      input.averageSystolic

    const diastolic =
      input.averageDiastolic


    if (
      systolic < 120 ||
      diastolic < 70
    ) {
      findings.push({
        id: Crypto.randomUUID(),

        type: 'blood-pressure-classification',

        title:
          'Presión arterial baja',

        description:
          'Los valores de presión arterial se encuentran por debajo del rango habitual recomendado.',

        severity:
          'moderate',

        guidelineId:
          context.guideline?.id,

        createdAt:
          new Date().toISOString(),
      })

      return findings
    }


    if (
      systolic >= 140 ||
      diastolic >= 90
    ) {
      findings.push({
        id: Crypto.randomUUID(),

        type: 'blood-pressure-classification',

        title:
          'Hipertensión arterial',

        description:
          'Los valores de presión arterial se encuentran por encima del rango recomendado.',

        severity:
          'moderate',

        guidelineId:
          context.guideline?.id,

        createdAt:
          new Date().toISOString(),
      })

      return findings
    }


    if (
      systolic >= 120 ||
      diastolic >= 70
    ) {
      findings.push({
        id: Crypto.randomUUID(),

        type: 'blood-pressure-classification',

        title:
          'Presión arterial elevada',

        description:
          'Los valores de presión arterial se encuentran por encima del rango óptimo.',

        severity:
          'low',

        guidelineId:
          context.guideline?.id,

        createdAt:
          new Date().toISOString(),
      })
    }


    return findings
  }
}
