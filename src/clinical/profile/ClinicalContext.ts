import { ClinicalGuideId } from '@/clinical/types/ClinicalGuide'

import { ClinicalHistory } from '../history/ClinicalHistory'
import { PatientProfile } from '../patient/PatientProfile'

export interface ClinicalContext {
  guide: ClinicalGuideId

  patient: PatientProfile

  history: ClinicalHistory
}
