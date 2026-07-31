import { ClinicalEngine } from '@/clinical/engine'
import { createClinicalGuide } from '@/clinical/selector/ClinicalGuideSelector'

export const clinicalEngine =
  new ClinicalEngine(
    createClinicalGuide('cardiosync'),
  )
