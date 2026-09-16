import { useState } from 'react'

import { ClinicalChartRange } from '../types/ClinicalChartRange'

export function useClinicalChartRange() {

  const [
    range,
    setRange,
  ] = useState<ClinicalChartRange>('week')

  return {
    range,
    setRange,
  }
}
