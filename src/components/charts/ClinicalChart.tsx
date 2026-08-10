import React from 'react'

import {
  CartesianChart,
  Line,
  Scatter,
  useChartTransformState,
} from 'victory-native'

import {
  StyleSheet,
  View,
} from 'react-native'

import { Card, Text } from '@/components/ui'

import { ClinicalEmptyState } from './ClinicalEmptyState'
import { ClinicalTargetLine } from './ClinicalTargetLine'

import { clinicalSeries } from './ClinicalChart/constants/clinicalSeries'

import type {
  ClinicalChartProps,
} from './ClinicalChart/types/ClinicalChartProps'

import type {
  ClinicalSeries,
} from './ClinicalChart/types/ClinicalSeries'

import type {
  ClinicalChartDataPoint,
} from './ClinicalChart/types/ClinicalChartData'

import {
  ClinicalNumericKey,
  getClinicalYKeys,
} from './ClinicalChart/utils/getClinicalYKeys'

import { buildChartData } from './ClinicalChart/utils/buildChartData'
import { downsampleClinicalData } from './ClinicalChart/utils/downsampleClinicalData'
import { useClinicalChartFont } from './ClinicalChart/hooks/useClinicalChartFont'

export function ClinicalChart({
  records,
  target,
  series,
}: ClinicalChartProps) {
  const data = downsampleClinicalData(
    buildChartData(records),
  )

  const activeSeries: ClinicalSeries[] =
    series ?? clinicalSeries

  const yKeys = getClinicalYKeys(
    activeSeries,
  )

  const transform = useChartTransformState({
    scaleX: 1.5,
    scaleY: 1,
  })

  const font = useClinicalChartFont()

  if (
    data.length === 0 ||
    yKeys.length === 0
  ) {
    return (
      <Card>
        <ClinicalEmptyState />
      </Card>
    )
  }

  return (
    <Card>
      <View style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          <CartesianChart<
            ClinicalChartDataPoint,
            'date',
            ClinicalNumericKey
          >
            data={data}
            xKey="date"
            yKeys={yKeys}
            transformState={transform.state}
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
              tickCount: 6,
              font,
              labelPosition: 'outset',
              labelOffset: 8,
              formatXLabel: value =>
                new Date(
                  String(value),
                ).toLocaleDateString([], {
                  day: '2-digit',
                  month: '2-digit',
                }),
              labelColor: '#64748B',
              lineColor: '#CBD5E1',
            }}
            yAxis={[
              {
                axisSide: 'left',
                tickCount: 7,
                font,
                labelPosition: 'outset',
                labelOffset: 8,
                formatYLabel: value =>
                  `${Math.round(
                    Number(value),
                  )}`,
                labelColor: '#64748B',
                lineColor: '#CBD5E1',
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
                  value={
                    target?.systolic ??
                    (activeSeries.some(
                      item =>
                        item.key ===
                        'systolic',
                    )
                      ? 120
                      : undefined)
                  }
                  yScale={yScale}
                  chartBounds={chartBounds}
                  color="#E65100"
                />

                <ClinicalTargetLine
                  value={
                    target?.diastolic ??
                    (activeSeries.some(
                      item =>
                        item.key ===
                        'diastolic',
                    )
                      ? 80
                      : undefined)
                  }
                  yScale={yScale}
                  chartBounds={chartBounds}
                  color="#1976D2"
                />

                {activeSeries.map(item => {
                  const itemPoints =
                    points[item.key]

                  if (!itemPoints) {
                    return null
                  }

                  return (
                    <React.Fragment
                      key={item.key}
                    >
                      <Line
                        points={itemPoints}
                        color={item.color}
                        strokeWidth={3}
                      />

                      <Scatter
                        points={itemPoints}
                        color={item.color}
                        radius={5}
                      />
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </CartesianChart>
        </View>

        <View style={styles.axisTitles}>
          <Text style={styles.yAxisTitle}>
            Valores clínicos
          </Text>

          <Text style={styles.xAxisTitle}>
            Fecha
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        {activeSeries.map(item => (
          <View
            key={item.key}
            style={styles.legendItem}
          >
            <View
              style={[
                styles.legendMarker,
                {
                  backgroundColor:
                    item.color,
                },
              ]}
            />

            <Text
              style={styles.legendLabel}
            >
              {item.label}
            </Text>

            <Text
              style={styles.legendUnit}
            >
              {item.unit}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  chartWrapper: {
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 16,
  },

  chartContainer: {
    height: 400,
    width: '100%',
  },

  axisTitles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 36,
    paddingRight: 12,
    paddingTop: 4,
  },

  yAxisTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  xAxisTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
    paddingHorizontal: 4,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  legendMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },

  legendUnit: {
    fontSize: 11,
    color: '#64748B',
  },
})
