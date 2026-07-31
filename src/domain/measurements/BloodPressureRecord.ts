export interface BloodPressureRecord {
  id: string

  dateTime: string

  systolic: number
  diastolic: number

  heartRate?: number

  weight?: number
  height?: number
  bmi?: number

  glucose?: number
  spo2?: number
  temperature?: number
  respiratoryRate?: number

  pain?: number

  arm?: 'left' | 'right'

  position?: 'sitting' | 'standing' | 'lying'

  device?: string

  cuffSize?: 'small' | 'medium' | 'large'

  context?: string

  symptoms?: string

  medicationTaken?: boolean

  medicationName?: string

  notes?: string

  guideline?: string

  createdAt: string

  updatedAt: string
}
