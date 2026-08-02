import { useMemo, useState } from 'react'

import {
  ClinicalSeries,
} from '../types/ClinicalSeries'

export function useClinicalChartSeriesSelection(
  initial: ClinicalSeries[],
) {

  const [
    selected,
    setSelected,
  ] = useState<ClinicalSeries[]>(
    initial,
  )

  function toggle(
    item: ClinicalSeries,
  ) {

    setSelected(current => {

      const exists =
        current.some(
          value =>
            value.key === item.key,
        )

      if (exists) {
        return current.filter(
          value =>
            value.key !== item.key,
        )
      }

      return [
        ...current,
        item,
      ]

    })
  }

  return useMemo(
    () => ({
      selected,
      toggle,
      setSelected,
    }),
    [
      selected,
    ],
  )
}
