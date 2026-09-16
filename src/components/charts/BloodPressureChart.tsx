import {
  ClinicalChart,
} from '@/components/charts/ClinicalChart'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

type Props = {
  records: BloodPressureRecord[]
}

export function BloodPressureChart({
  records,
}: Props) {
  return (
    <ClinicalChart
      records={records}
      target={{
        systolic: 120,
        diastolic: 80,
      }}
      series={[
        {
          key: 'systolic',
          label: 'Sistólica',
          color: '#388E3C',
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
      ]}
    />
  )
}
