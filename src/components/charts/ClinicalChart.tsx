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
import { ClinicalChartDataPoint } from './types/ClinicalChartData'
import { ClinicalChartProps } from './types/ClinicalChartProps'
import { buildChartData } from './utils/buildChartData'
import { downsampleClinicalData } from './utils/downsampleClinicalData'

export function ClinicalChart({
  records,
  target,
}: ClinicalChartProps) {
  const data = downsampleClinicalData(
    buildChartData(records),
  )

  const chartPressState =
    useChartPressState({
      x: '',
      y: {
        systolic: 0,
        diastolic: 0,
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
          'systolic' | 'diastolic'
        >
          data={data}
          xKey="date"
          yKeys={[
            'systolic',
            'diastolic',
          ]}
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

              <Line
                points={points.systolic}
                color="#D32F2F"
                strokeWidth={3}
              />

              <Scatter
                points={points.systolic}
                color="#D32F2F"
                radius={5}
              />

              <Line
                points={points.diastolic}
                color="#1976D2"
                strokeWidth={3}
              />

              <Scatter
                points={points.diastolic}
                color="#1976D2"
                radius={5}
              />
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
