import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import {
  ClinicalGuideEngine,
  ClinicalResult,
} from '../engine/ClinicalEngine'

export class Esc2024Guide
  implements ClinicalGuideEngine
{
  readonly id = 'esc2024'

  classify(
    record: BloodPressureRecord,
  ): ClinicalResult {
    const { systolic, diastolic } = record

    if (systolic >= 180 || diastolic >= 110) {
      return {
        classification: 'Hipertensión grado 3',
        color: '#991B1B',
        guideline: 'ESC 2024',
      }
    }

    if (systolic >= 160 || diastolic >= 100) {
      return {
        classification: 'Hipertensión grado 2',
        color: '#DC2626',
        guideline: 'ESC 2024',
      }
    }

    if (systolic >= 140 || diastolic >= 90) {
      return {
        classification: 'Hipertensión grado 1',
        color: '#EA580C',
        guideline: 'ESC 2024',
      }
    }

    if (systolic >= 130 || diastolic >= 85) {
      return {
        classification: 'Normal alta',
        color: '#CA8A04',
        guideline: 'ESC 2024',
      }
    }

    if (systolic >= 120 || diastolic >= 80) {
      return {
        classification: 'Normal',
        color: '#65A30D',
        guideline: 'ESC 2024',
      }
    }

    return {
      classification: 'Óptima',
      color: '#16A34A',
      guideline: 'ESC 2024',
    }
  }
}
