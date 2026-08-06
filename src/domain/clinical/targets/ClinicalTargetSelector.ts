import type { ClinicalContext } from '../models/ClinicalContext'

import type { ClinicalTarget } from './ClinicalTarget'

import {
  ClinicalTargetRepository,
} from './ClinicalTargetRepository'


export class ClinicalTargetSelector {
  static select(
    context: ClinicalContext,
    guidelineId: string,
  ): ClinicalTarget | undefined {

    const targets =
      ClinicalTargetRepository.getTargets(
        guidelineId,
      )

    if (context.olderAdult) {
      return targets.find(
        (target) =>
          target.population === 'mayores_80',
      )
    }

    return targets.find(
      (target) =>
        target.population === 'adultos_16_79',
    )
  }
}
