import { useMemo } from 'react'

import { ChartPressState } from 'victory-native'

export type ClinicalPressState =
  ChartPressState<{
    x: string

    y: {
      systolic: number

      diastolic: number
    }
  }>

export function useClinicalTooltip(
  state: ClinicalPressState,
) {
  return useMemo(
    () => ({
      visible: state.isActive.value,

      date: state.x.value.value,

      systolic:
        state.y.systolic.value.value,

      diastolic:
        state.y.diastolic.value.value,
    }),
    [state],
  )
}
