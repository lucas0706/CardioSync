import type { ClinicalContext } from '../models/ClinicalContext'

import type { ClinicalTarget } from './ClinicalTarget'

import {
  ClinicalTargetRepository,
} from './ClinicalTargetRepository'

import {
  ClinicalTargetMatcher,
} from './ClinicalTargetMatcher'

export class ClinicalTargetSelector {
  static select(
    context: ClinicalContext,
    guidelineId: string,
  ): ClinicalTarget | undefined {
    const targets =
      ClinicalTargetRepository.getTargets(
        guidelineId,
      )

    const population =
      context.age !== undefined &&
      context.age >= 80
        ? 'mayores_80'
        : 'adultos_16_79'

    const applicableTargets =
      targets
        .filter(
          target =>
            target.population ===
              population &&
            ClinicalTargetMatcher.matches(
              target,
              context,
            ),
        )
        .sort(
          (a, b) =>
            (b.priority ?? 0) -
            (a.priority ?? 0),
        )

    return (
      applicableTargets[0] ??
      targets.find(
        target =>
          target.population ===
          population,
      )
    )
  }
}
