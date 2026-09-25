import { useMemo } from 'react'
import { ChartPressState } from 'victory-native'

export function useClinicalTooltip(
  state: ChartPressState<any>,
) {
  return useMemo(
    () => ({
      visible: state.isActive.value,
      x: state.x.value.value,
      values: state.y,
    }),
    [state],
  )
}
