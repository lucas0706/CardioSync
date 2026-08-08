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


    const applicableTargets =
      targets.filter(
        (target) =>
          ClinicalTargetMatcher.matches(
            target,
            context,
          ),
      )


    if (context.age !== undefined) {

      const population =
        context.age >= 80
          ? 'mayores_80'
          : 'adultos_16_79'


      return (
        applicableTargets.find(
          (target) =>
            target.population === population,
        )
        ??
        targets.find(
          (target) =>
            target.population === population,
        )
      )
    }


    if (context.olderAdult) {

      return (
        applicableTargets.find(
          (target) =>
            target.population === 'mayores_80',
        )
        ??
        targets.find(
          (target) =>
            target.population === 'mayores_80',
        )
      )
    }


    return (
      applicableTargets.find(
        (target) =>
          target.population === 'adultos_16_79',
      )
      ??
      targets.find(
        (target) =>
          target.population === 'adultos_16_79',
      )
    )
  }
}
