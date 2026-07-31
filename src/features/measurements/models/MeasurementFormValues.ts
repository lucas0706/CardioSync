import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export interface MeasurementFormValues
  extends Omit<
    BloodPressureRecord,
    'id' | 'createdAt' | 'updatedAt'
  > {}
