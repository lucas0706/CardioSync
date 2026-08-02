import React from 'react'

import {
  Line,
  Scatter,
} from 'victory-native'

import {
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
                points[item.key]
              }
              color={
                item.color
              }
              strokeWidth={2.5}
            />

            <Scatter
              points={
                points[item.key]
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
