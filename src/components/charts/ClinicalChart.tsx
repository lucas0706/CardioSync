import React from 'react'

import {
  CartesianChart,
  Line,
  Scatter,
  useChartPressState,
  useChartTransformState,
} from 'victory-native'

import { StyleSheet, View } from 'react-native'

import { Card } from '@/components/ui'

import { ClinicalEmptyState } from './ClinicalEmptyState'
import { ClinicalTargetLine } from './ClinicalTargetLine'
import { ClinicalTooltip } from './ClinicalTooltip'
import { useClinicalTooltip } from './hooks/useClinicalTooltip'
import { defaultClinicalSeries } from './constants/clinicalSeries'
import { ClinicalChartDataPoint } from './types/ClinicalChartData'
import { ClinicalChartProps } from './types/ClinicalChartProps'
import { ClinicalSeries } from './types/ClinicalSeries'
import { buildChartData } from './utils/buildChartData'
import { downsampleClinicalData } from './utils/downsampleClinicalData'
import {
  ClinicalNumericKey,
  getClinicalYKeys,
} from './utils/getClinicalYKeys'

export function ClinicalChart({
  records,
  target,
  series,
}: ClinicalChartProps) {
  const data = downsampleClinicalData(
    buildChartData(records),
  )

  const activeSeries: ClinicalSeries[] =
    series ?? defaultClinicalSeries

  const yKeys = getClinicalYKeys(
    activeSeries,
  )

  const chartPressState =
    useChartPressState<{
      x: string
      y: {
        systolic: number
        diastolic: number
        heartRate: number
        weight: number
        glucose: number
        spo2: number
        temperature: number
        respiratoryRate: number
      }
    }>({
      x: '',
      y: {
        systolic: 0,
        diastolic: 0,
        heartRate: 0,
        weight: 0,
        glucose: 0,
        spo2: 0,
        temperature: 0,
        respiratoryRate: 0,
      },
    })

  const chartTransformState =
    useChartTransformState({
      scaleX: 1.5,
      scaleY: 1,
    })

  const tooltip = useClinicalTooltip(
    chartPressState.state,
  )

  if (data.length === 0) {
    return (
      <Card>
        <ClinicalEmptyState />
      </Card>
    )
  }

  return (
    <Card>
      <ClinicalTooltip
        visible={tooltip.visible}
        date={tooltip.date}
        systolic={tooltip.systolic}
        diastolic={tooltip.diastolic}
      />

      <View style={styles.chartContainer}>
        <CartesianChart<
          ClinicalChartDataPoint,
          'date',
          ClinicalNumericKey
        >
          data={data}
          xKey="date"
          yKeys={yKeys}
          chartPressState={
            chartPressState.state
          }
          transformState={
            chartTransformState.state
          }
          transformConfig={{
            pan: {
              dimensions: 'x',
            },
            pinch: {
              dimensions: 'x',
            },
          }}
          xAxis={{
            axisSide: 'bottom',
            tickCount: 5,
            formatXLabel: (value) =>
              new Date(
                value,
              ).toLocaleDateString(),
          }}
          yAxis={[
            {
              axisSide: 'left',
              tickCount: 5,
              formatYLabel: (value) =>
                `${value} mmHg`,
            },
          ]}
        >
          {({
            points,
            yScale,
            chartBounds,
          }) => (
            <>
              <ClinicalTargetLine
                value={target?.systolic}
                yScale={yScale}
                chartBounds={chartBounds}
                color="#D32F2F"
              />

              <ClinicalTargetLine
                value={target?.diastolic}
                yScale={yScale}
                chartBounds={chartBounds}
                color="#1976D2"
              />

              {activeSeries.map(
                (item) => (
                  <React.Fragment
                    key={item.key}
                  >
                    <Line
                      points={points[item.key]}
                      color={item.color}
                      strokeWidth={3}
                    />

                    <Scatter
                      points={points[item.key]}
                      color={item.color}
                      radius={5}
                    />
                  </React.Fragment>
                ),
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  chartContainer: {
    height: 320,
  },
})
