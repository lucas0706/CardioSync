import { useMemo } from 'react'

import {
  ChartPressState,
} from 'victory-native'

export interface ClinicalTooltipState {
  visible: boolean
  x: string
}

export function useClinicalChartTooltipState(
  state: ChartPressState<any>,
): ClinicalTooltipState {

  return useMemo(
    () => ({
      visible:
        state.isActive.value,

      x:
        String(
          state.x.value.value,
        ),
    }),
    [
      state,
    ],
  )
}
