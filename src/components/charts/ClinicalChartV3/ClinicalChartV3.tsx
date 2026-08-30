import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { LineChart } from 'react-native-gifted-charts'

import {
  Text,
} from '@/components/ui'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

import {
  aggregateMeasurementsForChart,
} from '@/features/statistics/utils/aggregateMeasurementsForChart'

import type {
  DailyChartRecord,
} from '@/features/statistics/utils/aggregateMeasurementsForChart'

import {
  ClinicalChartXAxisV3,
} from './ClinicalChartXAxisV3'

type SeriesVisibility = {
  systolic: boolean
  diastolic: boolean
  heartRate: boolean
}

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

interface Props {
  records: BloodPressureRecord[]
  period: '7d' | '30d' | '90d'
}

const COLORS = {
  systolic: '#16A34A',
  diastolic: '#2563EB',
  heartRate: '#DC2626',
  axis: '#64748B',
  axisLine: '#CBD5E1',
  rules: '#E2E8F0',
} as const

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
  records: DailyChartRecord[],
): ChartSeries {
  const sortedRecords =
    [...records].sort(
      (a, b) =>
        new Date(a.dateTime).getTime() -
        new Date(b.dateTime).getTime(),
    )

  const systolic: ChartPoint[] = []
  const diastolic: ChartPoint[] = []
  const heartRate: ChartPoint[] = []

  sortedRecords.forEach(record => {
    const date = new Date(
      record.dateTime,
    )

    const dateLabel =
      formatDate(date)

    systolic.push({
      value: record.systolic,
      date: dateLabel,
    })

    diastolic.push({
      value: record.diastolic,
      date: dateLabel,
    })

    if (
      record.heartRate !==
      undefined &&
      record.heartRate !== null
    ) {
      heartRate.push({
        value: record.heartRate,
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
  visibility: SeriesVisibility,
): YAxisScale {
  const values = [
    ...(visibility.systolic
      ? series.systolic.map(
          point => point.value,
        )
      : []),

    ...(visibility.diastolic
      ? series.diastolic.map(
          point => point.value,
        )
      : []),

    ...(visibility.heartRate
      ? series.heartRate.map(
          point => point.value,
        )
      : []),
  ]

  if (values.length === 0) {
    return {
      offset: 0,
      maxValue: 100,
      stepValue: 20,
      sections: 5,
    }
  }

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

function SeriesToggle({
  label,
  color,
  active,
  onPress,
}: {
  label: string
  color: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.seriesToggle,
        active
          ? styles.seriesToggleActive
          : styles.seriesToggleInactive,
      ]}
    >
      <View
        style={[
          styles.seriesIndicator,
          {
            backgroundColor:
              active
                ? color
                : '#CBD5E1',
          },
        ]}
      />

      <Text
        style={[
          styles.seriesToggleText,
          active
            ? styles.seriesToggleTextActive
            : styles.seriesToggleTextInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export function ClinicalChartV3({
  records,
  period,
}: Props) {
  const [visibility, setVisibility] =
    useState<SeriesVisibility>({
      systolic: true,
      diastolic: true,
      heartRate: true,
    })

  const [scrollX, setScrollX] =
    useState(0)

  useEffect(() => {
    setScrollX(0)
  }, [records])

  const dailyRecords = useMemo(
    () =>
      aggregateMeasurementsForChart(
        records,
      ),
    [records],
  )

  const series = useMemo(
    () =>
      createChartData(dailyRecords),
    [dailyRecords],
  )

  console.log(
    '[CardioSync][ClinicalChartV3] period:',
    period,
    'rawRecords:',
    records.length,
    'dailyRecords:',
    dailyRecords.length,
    'dates:',
    series.systolic.map(
      point => point.date,
    ),
  )

  const yAxis = useMemo(
    () =>
      calculateYAxisScale(
        series,
        visibility,
      ),
    [series, visibility],
  )

  const systolic = useMemo(
    () =>
      series.systolic.map(
        (point, index, array) => ({
          value: point.value,
          ...(index ===
          array.length - 1
            ? { spacing: 0 }
            : {}),
        }),
      ),
    [series],
  )

  const diastolic = useMemo(
    () =>
      series.diastolic.map(
        (point, index, array) => ({
          value: point.value,
          ...(index ===
          array.length - 1
            ? { spacing: 0 }
            : {}),
        }),
      ),
    [series],
  )

  const heartRate = useMemo(
    () =>
      series.heartRate.map(
        (point, index, array) => ({
          value: point.value,
          ...(index ===
          array.length - 1
            ? { spacing: 0 }
            : {}),
        }),
      ),
    [series],
  )

  const visibleSystolic =
    visibility.systolic
      ? systolic
      : []

  const visibleDiastolic =
    visibility.diastolic
      ? diastolic
      : []

  const visibleHeartRate =
    visibility.heartRate
      ? heartRate
      : []

  const allVisiblePoints =
    Math.max(
      visibleSystolic.length,
      visibleDiastolic.length,
      visibleHeartRate.length,
    )

  if (records.length === 0) {
    return (
      <View
        style={styles.emptyContainer}
      >
        <Text
          style={styles.emptyText}
        >
          No hay mediciones en este período.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.seriesSelector}>
        <SeriesToggle
          label="SIS"
          color={COLORS.systolic}
          active={
            visibility.systolic
          }
          onPress={() =>
            setVisibility(current => ({
              ...current,
              systolic:
                !current.systolic,
            }))
          }
        />

        <SeriesToggle
          label="DIA"
          color={COLORS.diastolic}
          active={
            visibility.diastolic
          }
          onPress={() =>
            setVisibility(current => ({
              ...current,
              diastolic:
                !current.diastolic,
            }))
          }
        />

        <SeriesToggle
          label="FC"
          color={COLORS.heartRate}
          active={
            visibility.heartRate
          }
          onPress={() =>
            setVisibility(current => ({
              ...current,
              heartRate:
                !current.heartRate,
            }))
          }
        />
      </View>

      {allVisiblePoints === 0 ? (
        <View
          style={styles.emptyContainer}
        >
          <Text
            style={styles.emptyText}
          >
            Activá al menos una serie.
          </Text>
        </View>
      ) : (
        <View
          style={styles.chartContainer}
        >
          <LineChart
            data={visibleSystolic}
            data2={visibleDiastolic}
            data3={visibleHeartRate}
            height={320}
            spacing={
              records.length <= 10
                ? undefined
                : 18
            }
            initialSpacing={12}
            endSpacing={0}
            adjustToWidth={
              records.length <= 10
            }
            thickness={2.5}
            thickness2={2.5}
            thickness3={2}
            color={COLORS.systolic}
            color2={COLORS.diastolic}
            color3={COLORS.heartRate}
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
            xAxisLabelTextStyle={
              styles.axisText
            }
            hideAxesAndRules={false}
            showVerticalLines={false}
            scrollEventThrottle={16}
            onScroll={(
              event: NativeSyntheticEvent<NativeScrollEvent>,
            ) => {
              setScrollX(
                event.nativeEvent.contentOffset.x,
              )
            }}
          />

          <ClinicalChartXAxisV3
            labels={series.systolic.map(
              point => point.date,
            )}
            period={period}
            scrollX={scrollX}
          />
        </View>
      )}
    </View>
  )
}

const styles =
  StyleSheet.create({
    container: {
      width: '100%',
    },

    seriesSelector: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },

    seriesToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8,
      borderWidth: 1,
    },

    seriesToggleActive: {
      borderColor: '#CBD5E1',
      backgroundColor: '#F8FAFC',
    },

    seriesToggleInactive: {
      borderColor: '#E2E8F0',
      backgroundColor: '#FFFFFF',
    },

    seriesIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },

    seriesToggleText: {
      fontSize: 13,
      fontWeight: '600',
    },

    seriesToggleTextActive: {
      color: '#334155',
    },

    seriesToggleTextInactive: {
      color: '#94A3B8',
    },

    chartContainer: {
      marginTop: 4,
      marginHorizontal: -8,
    },

    axisText: {
      color: COLORS.axis,
      fontSize: 10,
    },

    emptyContainer: {
      paddingVertical: 24,
      alignItems: 'center',
    },

    emptyText: {
      color: '#64748B',
      textAlign: 'center',
    },
  })
