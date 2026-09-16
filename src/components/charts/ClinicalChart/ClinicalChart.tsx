import {
  CartesianChart,
  useChartTransformState,
} from 'victory-native'

import {
  StyleSheet,
  View,
} from 'react-native'

import { ClinicalChartGrid } from './ClinicalChartGrid'
import { ClinicalChartBackground } from './ClinicalChartBackground'
import { ClinicalChartSeries } from './ClinicalChartSeries'
import { ClinicalTargetLines } from './ClinicalTargetLines'

import { clinicalSeries } from './constants/clinicalSeries'

import type { ClinicalChartProps } from './types/ClinicalChartProps'

import { useClinicalChartData } from './hooks/useClinicalChartData'
import { useClinicalChartConfig } from './hooks/useClinicalChartConfig'
import { useClinicalTargetLines } from './hooks/useClinicalTargetLines'
import { useClinicalChartFont } from './hooks/useClinicalChartFont'

import { getClinicalYKeys } from './utils/getClinicalYKeys'

export function ClinicalChart({
  records,
  series = clinicalSeries,
}: ClinicalChartProps) {
  const data =
    useClinicalChartData(records)

  const config =
    useClinicalChartConfig(series)

  const targets =
    useClinicalTargetLines(
      config.keys,
    )

  const font =
    useClinicalChartFont()

  const transform =
    useChartTransformState({
      scaleX: 1,
      scaleY: 1,
    })

  const yKeys =
    getClinicalYKeys(series)

  return (
    <View style={styles.chart}>
      <CartesianChart
        data={data}
        xKey="date"
        yKeys={yKeys}
        xAxis={{
          tickCount: 6,
          formatXLabel: value =>
            new Date(
              String(value),
            ).toLocaleDateString(
              [],
              {
                day: '2-digit',
                month: '2-digit',
              },
            ),
          font,
          labelColor: '#64748B',
          lineColor: '#CBD5E1',
        }}
        yAxis={[
          {
            tickCount: 7,
            font,
            formatYLabel: value =>
              `${Math.round(
                Number(value),
              )}`,
            labelColor: '#64748B',
            lineColor: '#CBD5E1',
          },
        ]}
        transformState={
          transform.state
        }
        transformConfig={{
          pan: {
            dimensions: 'x',
          },
          pinch: {
            dimensions: 'x',
          },
        }}
      >
        {({
          points,
          yScale,
          chartBounds,
        }) => (
          <>
            <ClinicalChartBackground
              chartBounds={
                chartBounds
              }
            />

            <ClinicalChartGrid
              chartBounds={
                chartBounds
              }
            />

            <ClinicalTargetLines
              target={targets}
              yScale={yScale}
              chartBounds={
                chartBounds
              }
            />

            {console.log(
              '[CardioSync][ClinicalChart] series:',
              series.map(item => item.key),
            )}

            {console.log(
              '[CardioSync][ClinicalChart] data:',
              data.map(item => ({
                date: item.date,
                systolic: item.systolic,
                diastolic: item.diastolic,
                heartRate: item.heartRate,
              })),
            )}

            {console.log(
              '[CardioSync][ClinicalChart] points keys:',
              Object.keys(points),
            )}

            {console.log(
              '[CardioSync][ClinicalChart] heartRate points:',
              points.heartRate,
            )}

            <ClinicalChartSeries
              points={points}
              series={series}
            />
          </>
        )}
      </CartesianChart>
    </View>
  )
}

const styles =
  StyleSheet.create({
    chart: {
      height: 380,
      width: '100%',
    },
  })
