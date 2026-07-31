export type BloodPressureCategory =
  | 'optimal'
  | 'normal'
  | 'high-normal'
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'isolated-systolic'

export interface ClassificationResult {
  category: BloodPressureCategory
  label: string
  color: string
}

export const BLOOD_PRESSURE_CLASSIFICATIONS: Record<
  BloodPressureCategory,
  ClassificationResult
> = {
  optimal: {
    category: 'optimal',
    label: 'Óptima',
    color: '#16A34A',
  },

  normal: {
    category: 'normal',
    label: 'Normal',
    color: '#65A30D',
  },

  'high-normal': {
    category: 'high-normal',
    label: 'Normal alta',
    color: '#CA8A04',
  },

  'grade-1': {
    category: 'grade-1',
    label: 'Hipertensión grado 1',
    color: '#EA580C',
  },

  'grade-2': {
    category: 'grade-2',
    label: 'Hipertensión grado 2',
    color: '#DC2626',
  },

  'grade-3': {
    category: 'grade-3',
    label: 'Hipertensión grado 3',
    color: '#991B1B',
  },

  'isolated-systolic': {
    category: 'isolated-systolic',
    label: 'Hipertensión sistólica aislada',
    color: '#7C3AED',
  },
}
