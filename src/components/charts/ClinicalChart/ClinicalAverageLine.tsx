import React from 'react'

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
  if (value === undefined) {
    return null
  }

  const y = yScale(value)

  return (
    <>
      <line
        x1={chartBounds.left}
        x2={chartBounds.right}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="8 6"
        opacity={0.9}
      />
    </>
  )
}
