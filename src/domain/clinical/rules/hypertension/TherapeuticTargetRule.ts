import * as Crypto from 'expo-crypto'

import type { ClinicalFinding } from '../../models/ClinicalFinding'
import type { ClinicalRule } from '../ClinicalRule'
import type { ClinicalRuleContext } from '../ClinicalRuleContext'

import {
  ClinicalTargetSelector,
} from '../../targets'

import type { StatisticsSummary } from '@/domain/statistics/models/StatisticsSummary'
import type { ClinicalContext } from '../../models/ClinicalContext'


export interface TherapeuticTargetInput {
  statistics: StatisticsSummary

  clinicalContext: ClinicalContext
}


export class TherapeuticTargetRule
implements ClinicalRule
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


    const target =
      ClinicalTargetSelector.select(
        input.clinicalContext,
        guidelineId,
      )


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
