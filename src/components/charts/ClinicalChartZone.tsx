import { Rect } from 'react-native-svg'

type Props = {
  yTop: number
  yBottom: number
  left: number
  right: number
  color: string
  opacity?: number
}

export function ClinicalChartZone({
  yTop,
  yBottom,
  left,
  right,
  color,
  opacity = 0.08,
}: Props) {
  return (
    <Rect
      x={left}
      y={Math.min(yTop, yBottom)}
      width={right - left}
      height={Math.abs(
        yBottom - yTop,
      )}
      fill={color}
      opacity={opacity}
    />
  )
}
