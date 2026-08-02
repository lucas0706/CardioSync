import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { ClinicalSeries } from './ClinicalSeries'
import { ClinicalTarget } from './ClinicalTarget'

export interface ClinicalChartProps {
  records: BloodPressureRecord[]
  target?: ClinicalTarget
  series?: ClinicalSeries[]
}
