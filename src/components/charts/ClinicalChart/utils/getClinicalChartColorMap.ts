import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export type ClinicalColorMap =
  Record<ClinicalSeriesKey, string>

export const clinicalColorMap:
  ClinicalColorMap = {

  systolic: '#C62828',

  diastolic: '#1565C0',

  heartRate: '#6A1B9A',

  weight: '#2E7D32',

  glucose: '#EF6C00',

  spo2: '#00838F',

  temperature: '#AD1457',

  respiratoryRate: '#37474F',
}
