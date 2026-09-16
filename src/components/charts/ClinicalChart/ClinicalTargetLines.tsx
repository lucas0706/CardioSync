import { Path, Skia } from '@shopify/react-native-skia'
import { ChartBounds } from 'victory-native'

import { ClinicalTarget } from './types/ClinicalTarget'

type Props = {
  target?: ClinicalTarget
  yScale: (value: number) => number
  chartBounds: ChartBounds
}

function TargetLine({
  value,
  color,
  yScale,
  chartBounds,
}: {
  value?: number
  color: string
  yScale: (value: number) => number
  chartBounds: ChartBounds
}) {
  if (value === undefined) {
    return null
  }

  const y = yScale(value)

  const path = Skia.Path.Make()

  path.moveTo(chartBounds.left, y)
  path.lineTo(chartBounds.right, y)

  return (
    <Path
      path={path}
      color={color}
      style="stroke"
      strokeWidth={1}
    />
  )
}

export function ClinicalTargetLines({
  target,
  yScale,
  chartBounds,
}: Props) {
  return (
    <>
      <TargetLine
        value={target?.systolic}
        color="#D32F2F"
        yScale={yScale}
        chartBounds={chartBounds}
      />

      <TargetLine
        value={target?.diastolic}
        color="#1976D2"
        yScale={yScale}
        chartBounds={chartBounds}
      />
    </>
  )
}
