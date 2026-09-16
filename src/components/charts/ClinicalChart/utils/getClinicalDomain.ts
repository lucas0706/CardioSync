import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface ClinicalDomain {
  min: number
  max: number
}

const DOMAINS: Record<ClinicalSeriesKey, ClinicalDomain> = {

  systolic: {
    min: 40,
    max: 220,
  },

  diastolic: {
    min: 20,
    max: 140,
  },

  heartRate: {
    min: 30,
    max: 220,
  },

  weight: {
    min: 20,
    max: 250,
  },

  glucose: {
    min: 20,
    max: 500,
  },

  spo2: {
    min: 70,
    max: 100,
  },

  temperature: {
    min: 30,
    max: 45,
  },

  respiratoryRate: {
    min: 5,
    max: 60,
  },
}

export function getClinicalDomain(
  key: ClinicalSeriesKey,
): ClinicalDomain {
  return DOMAINS[key]
}
