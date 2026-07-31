import { CardioSyncGuide } from '@/clinical/cardiosync/classification'
import { Esc2024Guide } from '@/clinical/esc2024/classification'
import { ClinicalGuideId } from '@/clinical/types/ClinicalGuide'

import { ClinicalGuideEngine } from '../engine'

export function createClinicalGuide(
  id: ClinicalGuideId,
): ClinicalGuideEngine {
  switch (id) {
    case 'esc2024':
      return new Esc2024Guide()

    case 'cardiosync':
    default:
      return new CardioSyncGuide()
  }
}
