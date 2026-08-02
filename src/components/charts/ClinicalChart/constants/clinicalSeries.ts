import { ClinicalSeries } from '../types/ClinicalSeries'

export const clinicalSeries: ClinicalSeries[] = [
  {
    key: 'systolic',
    label: 'Sistólica',
    color: '#D32F2F',
    unit: 'mmHg',
    symbol: 'square',
  },
  {
    key: 'diastolic',
    label: 'Diastólica',
    color: '#1976D2',
    unit: 'mmHg',
    symbol: 'circle',
  },
  {
    key: 'heartRate',
    label: 'Frecuencia cardíaca',
    color: '#7B1FA2',
    unit: 'lpm',
    symbol: 'triangle',
  },
  {
    key: 'weight',
    label: 'Peso',
    color: '#388E3C',
    unit: 'kg',
    symbol: 'square',
  },
  {
    key: 'glucose',
    label: 'Glucosa',
    color: '#F57C00',
    unit: 'mg/dL',
    symbol: 'circle',
  },
  {
    key: 'spo2',
    label: 'SpO₂',
    color: '#0097A7',
    unit: '%',
    symbol: 'triangle',
  },
  {
    key: 'temperature',
    label: 'Temperatura',
    color: '#C2185B',
    unit: '°C',
    symbol: 'square',
  },
  {
    key: 'respiratoryRate',
    label: 'Frecuencia respiratoria',
    color: '#455A64',
    unit: 'rpm',
    symbol: 'circle',
  },
]
