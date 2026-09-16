import { Line } from 'react-native-svg'

type Props = {
  value?: number
  yScale: (value: number) => number
  chartBounds: {
    left: number
    right: number
  }
  color: string
}

export function ClinicalAverageLine({
  value,
  yScale,
  chartBounds,
  color,
}: Props) {
  if (value == null) {
    return null
  }

  const y = yScale(value)

  return (
    <Line
      x1={chartBounds.left}
      x2={chartBounds.right}
      y1={y}
      y2={y}
      stroke={color}
      strokeWidth={2}
      strokeDasharray="6 6"
      opacity={0.7}
    />
  )
}
