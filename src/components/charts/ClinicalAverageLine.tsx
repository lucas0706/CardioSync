import {
  Path,
  Skia,
} from '@shopify/react-native-skia'

import { ChartBounds } from 'victory-native'

type Props = {
  value?: number

  yScale: (value: number) => number

  chartBounds: ChartBounds

  color: string
}

export function ClinicalAverageLine({
  value,
  yScale,
  chartBounds,
  color,
}: Props) {
  if (value === undefined) {
    return null
  }

  const y = yScale(value)

  const path = Skia.Path.Make()

  path.moveTo(
    chartBounds.left,
    y,
  )

  path.lineTo(
    chartBounds.right,
    y,
  )

  return (
    <Path
      path={path}
      color={color}
      style="stroke"
      strokeWidth={3}
      opacity={0.45}
    />
  )
}
