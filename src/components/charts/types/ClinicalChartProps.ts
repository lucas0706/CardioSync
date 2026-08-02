import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { ClinicalTarget } from './ClinicalTarget'

export interface ClinicalChartProps {
  records: BloodPressureRecord[]

  target?: ClinicalTarget
}
