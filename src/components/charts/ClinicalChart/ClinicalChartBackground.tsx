import { Rect } from '@shopify/react-native-skia'

import { ChartBounds } from 'victory-native'

import { getClinicalChartBackground } from './utils/getClinicalChartBackground'

type Props = {
  chartBounds: ChartBounds
}

export function ClinicalChartBackground({
  chartBounds,
}: Props) {

  return (
    <Rect
      x={chartBounds.left}
      y={chartBounds.top}
      width={
        chartBounds.right -
        chartBounds.left
      }
      height={
        chartBounds.bottom -
        chartBounds.top
      }
      color={getClinicalChartBackground()}
    />
  )
}
