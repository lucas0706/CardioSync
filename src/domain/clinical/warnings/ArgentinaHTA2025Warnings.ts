import type { ClinicalWarningRule } from './ClinicalWarningRule'


export const ArgentinaHTA2025Warnings:
ClinicalWarningRule[] = [

  {
    id: 'arg-hta-2025-low-blood-pressure',

    severity: 'caution',

    message:
      'No se recomienda buscar valores de presión arterial inferiores a 120/70 mmHg con tratamiento.',
  },


  {
    id: 'arg-hta-2025-low-diastolic-pressure',

    condition:
      'pad_below_70',

    severity: 'caution',

    message:
      'Se recomienda precaución cuando la presión arterial diastólica es inferior a 70 mmHg.',
  },

]
