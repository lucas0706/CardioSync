import { ClinicalSeries } from '../types/ClinicalSeries'

export const defaultClinicalSeries: ClinicalSeries[] = [
  {
    key: 'systolic',
    label: 'Sistólica',
    color: '#D32F2F',
    unit: 'mmHg',
  },
  {
    key: 'diastolic',
    label: 'Diastólica',
    color: '#1976D2',
    unit: 'mmHg',
  },
  {
    key: 'heartRate',
    label: 'Frecuencia cardíaca',
    color: '#7B1FA2',
    unit: 'lpm',
  },
  {
    key: 'weight',
    label: 'Peso',
    color: '#388E3C',
    unit: 'kg',
  },
  {
    key: 'glucose',
    label: 'Glucosa',
    color: '#F57C00',
    unit: 'mg/dL',
  },
  {
    key: 'spo2',
    label: 'Saturación',
    color: '#0097A7',
    unit: '%',
  },
  {
    key: 'temperature',
    label: 'Temperatura',
    color: '#C2185B',
    unit: '°C',
  },
  {
    key: 'respiratoryRate',
    label: 'Frecuencia respiratoria',
    color: '#455A64',
    unit: 'rpm',
  },
]
