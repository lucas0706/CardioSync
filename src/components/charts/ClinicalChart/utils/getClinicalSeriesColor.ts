import { ClinicalSeriesKey } from '../types/ClinicalSeries'

const COLORS: Record<ClinicalSeriesKey, string> = {

  systolic: '#D32F2F',

  diastolic: '#1976D2',

  heartRate: '#7B1FA2',

  weight: '#388E3C',

  glucose: '#F57C00',

  spo2: '#0097A7',

  temperature: '#C2185B',

  respiratoryRate: '#455A64',
}

export function getClinicalSeriesColor(
  key: ClinicalSeriesKey,
): string {
  return COLORS[key]
}
