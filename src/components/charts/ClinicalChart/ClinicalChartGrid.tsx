import { Group, Line } from '@shopify/react-native-skia'
import type { ChartBounds } from 'victory-native'

type Props = {
  chartBounds: ChartBounds
}

const MINOR = '#F8D7DA'
const MAJOR = '#F3B8BF'

export function ClinicalChartGrid({
  chartBounds,
}: Props) {
  const lines = []

  const width =
    chartBounds.right -
    chartBounds.left

  const height =
    chartBounds.bottom -
    chartBounds.top

  const minorX = width / 24
  const minorY = height / 20

  for (let i = 0; i <= 24; i++) {
    const x =
      chartBounds.left +
      i * minorX

    lines.push(
      <Line
        key={`vx-${i}`}
        p1={{
          x,
          y: chartBounds.top,
        }}
        p2={{
          x,
          y: chartBounds.bottom,
        }}
        color={
          i % 6 === 0
            ? MAJOR
            : MINOR
        }
        strokeWidth={
          i % 6 === 0
            ? 1
            : 0.35
        }
      />,
    )
  }

  for (let i = 0; i <= 20; i++) {
    const y =
      chartBounds.top +
      i * minorY

    lines.push(
      <Line
        key={`hy-${i}`}
        p1={{
          x: chartBounds.left,
          y,
        }}
        p2={{
          x: chartBounds.right,
          y,
        }}
        color={
          i % 5 === 0
            ? MAJOR
            : MINOR
        }
        strokeWidth={
          i % 5 === 0
            ? 1
            : 0.35
        }
      />,
    )
  }

  return (
    <Group>
      {lines}
    </Group>
  )
}
