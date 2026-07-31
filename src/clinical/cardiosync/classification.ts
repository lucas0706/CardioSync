import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import {
  ClinicalGuideEngine,
  ClinicalResult,
} from '../engine/ClinicalEngine'

export class CardioSyncGuide implements ClinicalGuideEngine {
  readonly id = 'cardiosync'

  classify(
    record: BloodPressureRecord,
  ): ClinicalResult {
    const { systolic, diastolic } = record

    if (systolic >= 180 || diastolic >= 120) {
      return {
        classification: 'Emergencia hipertensiva',
        color: '#7F1D1D',
        guideline: 'CardioSync',
      }
    }

    if (systolic >= 160 || diastolic >= 100) {
      return {
        classification: 'Muy alta',
        color: '#B91C1C',
        guideline: 'CardioSync',
      }
    }

    if (systolic >= 140 || diastolic >= 90) {
      return {
        classification: 'Alta',
        color: '#EA580C',
        guideline: 'CardioSync',
      }
    }

    if (systolic >= 130 || diastolic >= 85) {
      return {
        classification: 'Elevada',
        color: '#D97706',
        guideline: 'CardioSync',
      }
    }

    if (systolic >= 120 || diastolic >= 80) {
      return {
        classification: 'Normal',
        color: '#65A30D',
        guideline: 'CardioSync',
      }
    }

    return {
      classification: 'Óptima',
      color: '#16A34A',
      guideline: 'CardioSync',
    }
  }
}
