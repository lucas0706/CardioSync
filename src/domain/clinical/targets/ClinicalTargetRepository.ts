import type { ClinicalTarget } from './ClinicalTarget'

import {
  ConsensoArgentinaHTA2025Targets,
} from './guidelines'

export class ClinicalTargetRepository {
  static getTargets(
    guidelineId: string,
  ): ClinicalTarget[] {
    switch (guidelineId) {
      case 'consenso-hta-argentina-2025':
        return ConsensoArgentinaHTA2025Targets

      default:
        return []
    }
  }
}
