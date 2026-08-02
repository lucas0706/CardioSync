export interface MeasurementFormValues {
  systolic: number
  diastolic: number
  heartRate?: number
  arm?: 'left' | 'right'
  position?: 'sitting' | 'standing' | 'lying'
  notes?: string
}
