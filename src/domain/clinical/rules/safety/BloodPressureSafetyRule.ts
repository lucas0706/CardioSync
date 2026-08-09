import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRule } from '../ClinicalRule'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'


export interface BloodPressureSafetyRuleInput {
  averageSystolic: number
  averageDiastolic: number
}


export class BloodPressureSafetyRule
implements ClinicalRule
{

evaluate(
  input: BloodPressureSafetyRuleInput,
  context: ClinicalRuleContext,
): ClinicalFinding[] {

  const findings: ClinicalFinding[] = []


  if (
    input.averageDiastolic < 70
  ) {

    findings.push({
      id: Crypto.randomUUID(),

      type: 'safety-warning',

      title:
        'Presión arterial diastólica baja',

      description:
        'Se recomienda precaución cuando la presión arterial diastólica es inferior a 70 mmHg.',

      severity:
        'moderate',

      guidelineId:
        context.guideline?.id,

      createdAt:
        new Date().toISOString(),
    })

  }


  return findings
}

}
