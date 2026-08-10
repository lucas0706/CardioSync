import React from 'react'

import {
  Line,
  Scatter,
} from 'victory-native'

import type {
  ClinicalSeries,
} from './types/ClinicalSeries'

import {
  getClinicalMarkerStyle,
} from './utils/getClinicalMarkerStyle'

type Props = {
  points: Record<string, any>
  series: ClinicalSeries[]
}

export function ClinicalChartSeries({
  points,
  series,
}: Props) {
  return (
    <>
      {series.map(item => {
        const seriesPoints =
          points[item.key]

        if (!seriesPoints) {
          return null
        }

        const marker =
          getClinicalMarkerStyle(
            item.key,
          )

        return (
          <React.Fragment
            key={item.key}
          >
            <Line
              points={
                seriesPoints
              }
              color={
                item.color
              }
              strokeWidth={2.5}
            />

            <Scatter
              points={
                seriesPoints
              }
              color={
                item.color
              }
              radius={
                marker.size
              }
            />
          </React.Fragment>
        )
      })}
    </>
  )
}
