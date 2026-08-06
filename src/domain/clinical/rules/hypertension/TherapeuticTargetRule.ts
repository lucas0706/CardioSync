import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRule } from '../ClinicalRule'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'

import {
  ClinicalTargetRepository,
} from '../../targets'

import type { StatisticsSummary } from '@/domain/statistics/models/StatisticsSummary'


export interface TherapeuticTargetInput {
  statistics: StatisticsSummary
}


export class TherapeuticTargetRule
  implements ClinicalRule<TherapeuticTargetInput>
{
  evaluate(
    input: TherapeuticTargetInput,
    context: ClinicalRuleContext,
  ): ClinicalFinding[] {

    const guidelineId =
      context.guideline?.id

    if (!guidelineId) {
      return []
    }

    const targets =
      ClinicalTargetRepository.getTargets(
        guidelineId,
      )

    const target =
      targets[0]

    if (!target) {
      return []
    }

    const systolic =
      input.statistics.averageSystolic

    const diastolic =
      input.statistics.averageDiastolic


    const controlled =
      target.systolic?.max !== undefined &&
      target.diastolic?.max !== undefined &&
      systolic <= target.systolic.max &&
      diastolic <= target.diastolic.max


    return [
      {
        id: Crypto.randomUUID(),

        type: 'therapeutic-target',

        title: controlled
          ? 'Presión arterial dentro del objetivo terapéutico'
          : 'Presión arterial por encima del objetivo terapéutico',

        description:
          `Evaluación según ${context.guideline?.name ?? 'guía clínica'}.`,

        severity: controlled
          ? 'low'
          : 'moderate',

        guidelineId,

        createdAt:
          new Date().toISOString(),
      },
    ]
  }
}
