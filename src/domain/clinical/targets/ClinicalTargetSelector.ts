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
      context.age !== undefined
        ? context.age >= 80
          ? 'mayores_80'
          : 'adultos_16_79'
        : context.olderAdult
          ? 'mayores_80'
          : 'adultos_16_79'


    const applicableTargets =
      targets
        .filter(
          (target) =>
            target.population === population &&
            ClinicalTargetMatcher.matches(
              target,
              context,
            ),
        )
        .sort(
          (a, b) =>
            this.getSpecificityScore(b) -
            this.getSpecificityScore(a),
        )


    return (
      applicableTargets[0]
      ??
      targets.find(
        (target) =>
          target.population === population,
      )
    )
  }


  private static getSpecificityScore(
    target: ClinicalTarget,
  ): number {

    if (!target.conditions) {
      return 0
    }


    return target.conditions.reduce(
      (score, condition) => {

        if (condition === 'poblacion_general') {
          return score
        }

        return score + 10

      },
      0,
    )
  }
}
