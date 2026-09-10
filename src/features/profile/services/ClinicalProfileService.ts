import type { ClinicalContext } from '@/domain/clinical/models/ClinicalContext'

import {
  clinicalProfileRepository,
} from '@/core/database/ClinicalProfileRepository'

export class ClinicalProfileService {
  get(
    patientId: string,
  ): ClinicalContext | undefined {
    return clinicalProfileRepository.getByPatientId(
      patientId,
    )
  }

  save(
    context: ClinicalContext,
  ): void {
    clinicalProfileRepository.save(context)
  }

  delete(
    patientId: string,
  ): void {
    clinicalProfileRepository.delete(patientId)
  }

  exists(
    patientId: string,
  ): boolean {
    return clinicalProfileRepository.exists(
      patientId,
    )
  }
}

export const clinicalProfileService =
  new ClinicalProfileService()
