import type { ClinicalContext } from '../models/ClinicalContext'

import type { ClinicalTarget } from './ClinicalTarget'

export class ClinicalTargetMatcher {
  static matches(
    target: ClinicalTarget,
    context: ClinicalContext,
  ): boolean {
    if (
      !target.conditions ||
      target.conditions.length === 0
    ) {
      return true
    }

    return target.conditions.every(
      condition =>
        this.evaluateCondition(
          condition,
          context,
        ),
    )
  }

  private static evaluateCondition(
    condition: string,
    context: ClinicalContext,
  ): boolean {
    switch (condition) {
      case 'poblacion_general':
        return true

      case 'buena_tolerancia':
        return false

      case 'diabetes':
        return context.diabetes === true

      case 'enfermedad_renal_cronica':
        return (
          context.chronicKidneyDisease === true
        )

      case 'enfermedad_cardiovascular':
        return (
          context.cardiovascularDisease === true
        )

      default:
        return false
    }
  }
}
