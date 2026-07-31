import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export interface ClinicalHistory {
  measurements: BloodPressureRecord[]
}
