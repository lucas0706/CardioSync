import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export interface AxisConfig {
  min: number
  max: number
  step: number
  unit: string
}

const CONFIG: Record<ClinicalSeriesKey, AxisConfig> = {
  systolic: {
    min: 70,
    max: 220,
    step: 10,
    unit: 'mmHg',
  },
  diastolic: {
    min: 40,
    max: 140,
    step: 10,
    unit: 'mmHg',
  },
  heartRate: {
    min: 40,
    max: 180,
    step: 20,
    unit: 'lpm',
  },
  weight: {
    min: 30,
    max: 200,
    step: 10,
    unit: 'kg',
  },
  glucose: {
    min: 40,
    max: 350,
    step: 25,
    unit: 'mg/dL',
  },
  spo2: {
    min: 80,
    max: 100,
    step: 2,
    unit: '%',
  },
  temperature: {
    min: 34,
    max: 42,
    step: 1,
    unit: '°C',
  },
  respiratoryRate: {
    min: 8,
    max: 40,
    step: 2,
    unit: 'rpm',
  },
}

export function getDynamicAxisConfig(
  key: ClinicalSeriesKey,
): AxisConfig {
  return CONFIG[key]
}
