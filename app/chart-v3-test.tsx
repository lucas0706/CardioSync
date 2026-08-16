import { useEffect, useMemo, useState } from 'react'
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { LineChart } from 'react-native-gifted-charts'

import {
  Card,
  Screen,
  Text,
} from '@/components/ui'

import {
  clinicalChartRealMeasurements,
} from '@/features/clinicalChartV3/data/clinicalChartRealMeasurements'

import { ClinicalChartXAxisV3 } from '@/components/charts/ClinicalChartV3/ClinicalChartXAxisV3'

type Period =
  | '7d'
  | '30d'
  | '90d'

type ChartPoint = {
  value: number
  date: string
}

type ChartSeries = {
  systolic: ChartPoint[]
  diastolic: ChartPoint[]
  heartRate: ChartPoint[]
}

type YAxisScale = {
  offset: number
  maxValue: number
  stepValue: number
  sections: number
}

const COLORS = {
  systolic: '#16A34A',
  diastolic: '#2563EB',
  heartRate: '#DC2626',
  axis: '#64748B',
  axisLine: '#CBD5E1',
  rules: '#E2E8F0',
} as const

function getDays(
  period: Period,
): number {
  switch (period) {
    case '7d':
      return 7

    case '30d':
      return 30

    case '90d':
      return 90
  }
}

function formatDate(
  date: Date,
): string {
  return `${String(
    date.getDate(),
  ).padStart(2, '0')}/${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}`
}

function createChartData(
  period: Period,
): ChartSeries {
  const days = getDays(period)

  const lastMeasurement =
    clinicalChartRealMeasurements[
      clinicalChartRealMeasurements.length - 1
    ]

  const endDate = new Date(
    lastMeasurement.dateTime,
  )

  const startDate = new Date(endDate)

  startDate.setDate(
    endDate.getDate() - (days - 1),
  )

  const filtered =
    clinicalChartRealMeasurements
      .filter(point => {
        const date = new Date(
          point.dateTime,
        )

        return (
          date >= startDate &&
          date <= endDate
        )
      })
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(),
      )

  const systolic: ChartPoint[] = []
  const diastolic: ChartPoint[] = []
  const heartRate: ChartPoint[] = []

  filtered.forEach(point => {
    const date = new Date(
      point.dateTime,
    )

    const dateLabel =
      formatDate(date)

    systolic.push({
      value: point.systolic,
      date: dateLabel,
    })

    diastolic.push({
      value: point.diastolic,
      date: dateLabel,
    })

    if (point.heartRate !== null) {
      heartRate.push({
        value: point.heartRate,
        date: dateLabel,
      })
    }
  })

  return {
    systolic,
    diastolic,
    heartRate,
  }
}

function calculateYAxisScale(
  series: ChartSeries,
): YAxisScale {
  const values = [
    ...series.systolic.map(
      point => point.value,
    ),
    ...series.diastolic.map(
      point => point.value,
    ),
    ...series.heartRate.map(
      point => point.value,
    ),
  ]

  const minimum = Math.min(
    ...values,
  )

  const maximum = Math.max(
    ...values,
  )

  const dataRange =
    Math.max(
      maximum - minimum,
      20,
    )

  /*
   * Margen pequeño alrededor de los
   * valores reales.
   */
  const margin =
    Math.max(
      3,
      Math.ceil(
        dataRange * 0.05,
      ),
    )

  const minimumScale =
    Math.floor(
      (minimum - margin) / 5,
    ) * 5

  const maximumScale =
    Math.ceil(
      (maximum + margin) / 5,
    ) * 5

  const offset =
    Math.max(
      0,
      minimumScale,
    )

  const range =
    maximumScale - offset

  /*
   * Elegimos un número compacto de
   * secciones según el rango real.
   */
  let stepValue: number

  if (range <= 40) {
    stepValue = 5
  } else if (range <= 80) {
    stepValue = 10
  } else if (range <= 160) {
    stepValue = 20
  } else {
    stepValue = 25
  }

  const sections =
    Math.max(
      1,
      Math.ceil(
        range / stepValue,
      ),
    )

  const maxValue =
    stepValue * sections

  return {
    offset,
    maxValue,
    stepValue,
    sections,
  }
}

function buildXAxisLabels(
  series: ChartSeries,
  period: Period,
): string[] {
  const days = getDays(period)

  const interval =
    period === '7d'
      ? 1
      : period === '30d'
        ? 5
        : 15

  return series.systolic.map(
    (point, index) => {
      const isInterval =
        index % interval === 0

      const isLast =
        index === days - 1

      if (
        isInterval ||
        isLast
      ) {
        return point.date
      }

      return ''
    },
  )
}

function PeriodSelector({
  period,
  onChange,
}: {
  period: Period
  onChange: (
    period: Period,
  ) => void
}) {
  const periods: Period[] = [
    '7d',
    '30d',
    '90d',
  ]

  return (
    <View style={styles.periods}>
      {periods.map(item => {
        const active =
          item === period

        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{
              selected: active,
            }}
            onPress={() =>
              onChange(item)
            }
            style={[
              styles.periodButton,
              active &&
                styles.periodButtonActive,
            ]}
          >
            <Text
              style={
                active
                  ? styles.periodTextActive
                  : styles.periodText
              }
            >
              {item === '7d'
                ? '7 días'
                : item === '30d'
                  ? '30 días'
                  : '90 días'}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

function LegendItem({
  color,
  label,
}: {
  color: string
  label: string
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          {
            backgroundColor:
              color,
          },
        ]}
      />

      <Text
        style={styles.legendText}
      >
        {label}
      </Text>
    </View>
  )
}

export default function ClinicalChartV3TestScreen() {
  const [period, setPeriod] =
    useState<Period>('30d')

  const [scrollX, setScrollX] =
    useState(0)

  useEffect(() => {
    setScrollX(0)
  }, [period])

  const series = useMemo(
    () =>
      createChartData(period),
    [period],
  )

  const yAxis = useMemo(
    () =>
      calculateYAxisScale(
        series,
      ),
    [series],
  )

  const xAxisLabels = useMemo(
    () =>
      buildXAxisLabels(
        series,
        period,
      ),
    [series, period],
  )

  const systolic = useMemo(
    () =>
      series.systolic.map(
        (point, index, array) => ({
          value: point.value,
          ...(period !== '7d' &&
          index === array.length - 1
            ? { spacing: 0 }
            : {}),
        }),
      ),
    [series, period],
  )

  const diastolic = useMemo(
    () =>
      series.diastolic.map(
        (point, index, array) => ({
          value: point.value,
          ...(period !== '7d' &&
          index === array.length - 1
            ? { spacing: 0 }
            : {}),
        }),
      ),
    [series, period],
  )

  const heartRate = useMemo(
    () =>
      series.heartRate.map(
        (point, index, array) => ({
          value: point.value,
          ...(period !== '7d' &&
          index === array.length - 1
            ? { spacing: 0 }
            : {}),
        }),
      ),
    [series, period],
  )

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View
          style={styles.header}
        >
          <Text
            style={styles.title}
          >
            ClinicalChart V3
          </Text>

          <Text
            style={styles.subtitle}
          >
            Laboratorio de visualización
          </Text>
        </View>

        <Card
          style={styles.chartCard}
        >
          <View
            style={styles.chartHeader}
          >
            <View
              style={
                styles.chartHeaderText
              }
            >
              <Text
                variant="h2"
              >
                Evolución
              </Text>

              <Text
                style={
                  styles.chartSubtitle
                }
              >
                Presión arterial y pulso
              </Text>
            </View>
          </View>

          <PeriodSelector
            period={period}
            onChange={
              setPeriod
            }
          />

          <View
            style={styles.chartContainer}
          >
            <LineChart
              data={systolic}
              data2={diastolic}
              data3={heartRate}
              height={320}
              spacing={
                period === '7d'
                  ? undefined
                  : period === '30d'
                    ? 18
                    : 6
              }
              initialSpacing={12}
              endSpacing={
                period === '7d'
                  ? 0
                  : 0
              }
              adjustToWidth={
                period === '7d'
              }
              thickness={2.5}
              thickness2={2.5}
              thickness3={2}
              color={
                COLORS.systolic
              }
              color2={
                COLORS.diastolic
              }
              color3={
                COLORS.heartRate
              }
              curved
              curvature={0.18}
              areaChart
              areaChart2
              areaChart3
              startFillColor={
                COLORS.systolic
              }
              endFillColor={
                COLORS.systolic
              }
              startOpacity={0.14}
              endOpacity={0.015}
              startFillColor2={
                COLORS.diastolic
              }
              endFillColor2={
                COLORS.diastolic
              }
              startOpacity2={0.10}
              endOpacity2={0.01}
              startFillColor3={
                COLORS.heartRate
              }
              endFillColor3={
                COLORS.heartRate
              }
              startOpacity3={0.07}
              endOpacity3={0.005}
              hideDataPoints
              hideDataPoints2
              hideDataPoints3
              dataPointsRadius={0}
              dataPointsRadius2={0}
              dataPointsRadius3={0}
              hideRules={false}
              rulesColor={
                COLORS.rules
              }
              rulesType="dashed"
              rulesThickness={1}
              yAxisColor={
                COLORS.axisLine
              }
              xAxisColor={
                COLORS.axisLine
              }
              yAxisTextStyle={
                styles.axisText
              }
              xAxisLabelTextStyle={
                period === '7d'
                  ? styles.axisText
                  : styles.axisTextRotated
              }
              xAxisTextNumberOfLines={
                1
              }
              xAxisLabelsHeight={
                24
              }
              xAxisLabelTexts={
                xAxisLabels.map(
                  () => '',
                )
              }
              yAxisLabelWidth={38}
              yAxisOffset={
                yAxis.offset
              }
              maxValue={
                yAxis.maxValue
              }
              stepValue={
                yAxis.stepValue
              }
              noOfSections={
                yAxis.sections
              }
              showVerticalLines={
                false
              }
              isAnimated={false}
              focusEnabled={false}
              showTextOnFocus={false}
              disableScroll={
                period === '7d'
              }
              onScroll={
                (
                  event: NativeSyntheticEvent<NativeScrollEvent>,
                ) =>
                  setScrollX(
                    event.nativeEvent
                      .contentOffset.x,
                  )
              }
            />
          </View>

          <ClinicalChartXAxisV3
            labels={xAxisLabels}
            period={period}
            scrollX={scrollX}
          />

          <View
            style={styles.legend}
          >
            <LegendItem
              color={
                COLORS.systolic
              }
              label="Sistólica"
            />

            <LegendItem
              color={
                COLORS.diastolic
              }
              label="Diastólica"
            />

            <LegendItem
              color={
                COLORS.heartRate
              }
              label="Pulso"
            />
          </View>
        </Card>

        <Card>
          <Text
            variant="h2"
          >
            Próximamente
          </Text>

          <Text
            style={styles.infoText}
          >
            La selección de mediciones,
            el detalle de valores y la
            vista horizontal se incorporarán
            después de validar esta base
            visual.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  )
}

const styles =
  StyleSheet.create({
    content: {
      gap: 16,
      paddingBottom: 32,
    },

    header: {
      gap: 4,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
    },

    subtitle: {
      color: '#64748B',
    },

    chartCard: {
      overflow: 'hidden',
    },

    chartHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    chartHeaderText: {
      gap: 3,
    },

    chartSubtitle: {
      color: '#64748B',
      fontSize: 13,
    },

    periods: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 18,
    },

    periodButton: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor:
        '#F1F5F9',
    },

    periodButtonActive: {
      backgroundColor:
        '#0F172A',
    },

    periodText: {
      color: '#475569',
      fontSize: 13,
      fontWeight: '600',
    },

    periodTextActive: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },

    chartContainer: {
      marginTop: 18,
      marginHorizontal: -8,
    },

    axisText: {
      color: COLORS.axis,
      fontSize: 10,
    },

    axisTextRotated: {
      color: COLORS.axis,
      fontSize: 10,
      transform: [
        {
          rotate: '-45deg',
        },
      ],
    },

    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 18,
      marginTop: 6,
    },

    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },

    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },

    legendText: {
      fontSize: 13,
      color: '#475569',
    },

    infoText: {
      marginTop: 8,
      lineHeight: 21,
      color: '#64748B',
    },
  })
