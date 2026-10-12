import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import SkiaChart, { SkiaRenderer, type ChartElement } from '@wuba/react-native-echarts/skiaChart'
import type { EChartsOption, TooltipComponentFormatterCallbackParams } from 'echarts'
import { LineChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'

import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkLineComponent,
  LegendComponent,
  SkiaRenderer,
])

const CHART_HEIGHT = 350
const tooltipDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const SERIES = [
  { name: 'Sistólica', color: '#4CAF50' },
  { name: 'Diastólica', color: '#2196F3' },
  { name: 'Pulso', color: '#F44336' },
] as const

type SeriesName = (typeof SERIES)[number]['name']
type ChartInstance = ReturnType<typeof echarts.init>

interface Props {
  data: BloodPressureRecord[]
}

interface DailyReading {
  timestamp: number
  systolicSum: number
  diastolicSum: number
  heartRateSum: number
  heartRateCount: number
  count: number
}

interface DailyAverage {
  timestamp: number
  systolic: number
  diastolic: number
  heartRate: number | null
}

type NumericPoint = [number, number]
type NullableNumericPoint = [number, number | null]

interface EChartsProps {
  option: EChartsOption
  width: number
  chartInstanceRef: { current: ChartInstance | null }
}

const ECharts = memo(function ECharts({ option, width, chartInstanceRef }: EChartsProps) {
  const chartRef = useRef<ChartElement | null>(null)

  useEffect(() => {
    const chartElement = chartRef.current

    if (!chartElement) {
      return
    }

    const chart = echarts.init(chartElement as unknown as HTMLElement, undefined, {
      // ECharts' renderer type omits renderers registered by extensions.
      // @ts-expect-error SkiaRenderer registers the "skia" renderer at runtime.
      renderer: 'skia',
      width,
      height: CHART_HEIGHT,
    })
    chartInstanceRef.current = chart

    return () => {
      chart.dispose()
      chartInstanceRef.current = null
    }
  }, [chartInstanceRef])

  useEffect(() => {
    chartInstanceRef.current?.resize({
      width,
      height: CHART_HEIGHT,
    })
  }, [width])

  useEffect(() => {
    chartInstanceRef.current?.setOption(option, {
      lazyUpdate: true,
    })
  }, [option, chartInstanceRef])

  return (
    <SkiaChart
      ref={chartRef}
      style={{
        width,
        height: CHART_HEIGHT,
      }}
    />
  )
})

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatTooltipDate(timestamp: number): string {
  return tooltipDateFormatter.format(timestamp)
}

function BloodPressureChartComponent({ data }: Props) {
  const { width: screenWidth } = useWindowDimensions()
  const chartWidth = Math.max(1, screenWidth - 32)
  const chartInstanceRef = useRef<ChartInstance | null>(null)
  const [seriesVisibility, setSeriesVisibility] = useState<Record<SeriesName, boolean>>({
    Sistólica: true,
    Diastólica: true,
    Pulso: true,
  })

  const toggleSeries = useCallback(
    (name: SeriesName) => {
      const selected = seriesVisibility[name]
      chartInstanceRef.current?.dispatchAction({
        type: selected ? 'legendUnSelect' : 'legendSelect',
        name,
      })
      setSeriesVisibility((current) => ({
        ...current,
        [name]: !selected,
      }))
    },
    [seriesVisibility],
  )

  const seriesData = useMemo(() => {
    const dailyGroups = new Map<string, DailyReading>()

    for (const record of data) {
      const date = new Date(record.dateTime)
      const systolic = Number(record.systolic)
      const diastolic = Number(record.diastolic)

      if (
        !Number.isFinite(date.getTime()) ||
        !Number.isFinite(systolic) ||
        !Number.isFinite(diastolic)
      ) {
        continue
      }

      const dateKey = getLocalDateKey(date)
      let group = dailyGroups.get(dateKey)

      if (!group) {
        group = {
          timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
          systolicSum: 0,
          diastolicSum: 0,
          heartRateSum: 0,
          heartRateCount: 0,
          count: 0,
        }
        dailyGroups.set(dateKey, group)
      }

      group.systolicSum += systolic
      group.diastolicSum += diastolic
      group.count += 1

      if (record.heartRate !== undefined && record.heartRate !== null) {
        const heartRate = Number(record.heartRate)

        if (Number.isFinite(heartRate)) {
          group.heartRateSum += heartRate
          group.heartRateCount += 1
        }
      }
    }

    const dailyAverages: DailyAverage[] = Array.from(dailyGroups.values(), (group) => ({
      timestamp: group.timestamp,
      systolic: Math.round(group.systolicSum / group.count),
      diastolic: Math.round(group.diastolicSum / group.count),
      heartRate:
        group.heartRateCount > 0 ? Math.round(group.heartRateSum / group.heartRateCount) : null,
    })).sort((first, second) => first.timestamp - second.timestamp)

    return {
      systolic: dailyAverages.map(({ timestamp, systolic }): NumericPoint => [timestamp, systolic]),
      diastolic: dailyAverages.map(({ timestamp, diastolic }): NumericPoint => [
        timestamp,
        diastolic,
      ]),
      heartRate: dailyAverages.map(({ timestamp, heartRate }): NullableNumericPoint => [
        timestamp,
        heartRate,
      ]),
    }
  }, [data])

  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: '#0D100B',
      animation: false,
      animationDuration: 0,
      animationDurationUpdate: 0,
      grid: {
        left: '3%',
        right: '4%',
        top: '6%',
        bottom: '14%',
        containLabel: true,
      },
      legend: {
        show: false,
        data: SERIES.map(({ name }) => name),
      },
      tooltip: {
        trigger: 'axis',
        renderMode: 'richText',
        backgroundColor: '#1F211D',
        borderColor: '#454A41',
        showDelay: 0,
        hideDelay: 0,
        transitionDuration: 0,
        confine: true,
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          const items = Array.isArray(params) ? params : [params]
          const firstValue = items[0]?.value
          const timestamp = Array.isArray(firstValue) ? Number(firstValue[0]) : Number.NaN
          const dateLabel = Number.isFinite(timestamp)
            ? formatTooltipDate(timestamp)
            : 'Fecha no disponible'
          const readings = items.map((item) => {
            const value = Array.isArray(item.value) ? item.value[1] : item.value
            const formattedValue =
              typeof value === 'number' && Number.isFinite(value) ? String(Math.round(value)) : '--'

            return `${item.marker ?? ''} ${item.seriesName ?? ''}: ${formattedValue}`
          })

          return [dateLabel, ...readings].join('\n')
        },
        textStyle: {
          color: '#F1F2EE',
          fontSize: 12,
        },
        axisPointer: {
          type: 'line',
          animation: false,
          lineStyle: {
            color: '#9CA39A',
            opacity: 0.45,
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          throttle: 16,
          realtime: true,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
        },
      ],
      xAxis: {
        type: 'time',
        boundaryGap: ['5%', '5%'],
        splitNumber: 6,
        axisLabel: {
          formatter: '{dd}',
          hideOverlap: true,
          color: '#B5B9AF',
          fontSize: 9,
        },
        axisLine: {
          lineStyle: { color: '#454A41' },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#42473E',
            opacity: 0.35,
          },
        },
      },
      yAxis: {
        type: 'value',
        min: (value) => Math.floor(value.min - 5),
        max: (value) => Math.ceil(value.max + 5),
        interval: 4,
        axisLabel: {
          color: '#B5B9AF',
          fontSize: 9,
        },
        axisLine: {
          show: true,
          lineStyle: { color: '#454A41' },
        },
        splitLine: {
          lineStyle: {
            color: '#42473E',
            opacity: 0.45,
          },
        },
      },
      series: [
        {
          id: 'systolic-series',
          name: 'Sistólica',
          type: 'line',
          data: seriesData.systolic,
          smooth: true,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          sampling: 'lttb',
          large: true,
          largeThreshold: 400,
          hoverLayerThreshold: 1000,
          itemStyle: { color: '#4CAF50' },
          lineStyle: {
            color: '#4CAF50',
            width: 1.8,
          },
          emphasis: {
            focus: 'series',
            scale: true,
            itemStyle: {
              color: '#FFEB3B',
              borderColor: '#FFFFFF',
              borderWidth: 1,
            },
          },
          markLine: {
            symbol: 'none',
            lineStyle: {
              color: '#D98963',
              type: 'dashed',
              width: 1,
            },
            label: {
              show: true,
              position: 'end',
              align: 'right',
              color: '#D9D5CC',
              fontSize: 9,
              formatter: 'Objetivo (Alto 130)',
            },
            data: [{ yAxis: 130 }],
          },
        },
        {
          id: 'diastolic-series',
          name: 'Diastólica',
          type: 'line',
          data: seriesData.diastolic,
          smooth: true,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          sampling: 'lttb',
          large: true,
          largeThreshold: 400,
          hoverLayerThreshold: 1000,
          itemStyle: { color: '#2196F3' },
          lineStyle: {
            color: '#2196F3',
            width: 1.8,
          },
          emphasis: {
            focus: 'series',
            scale: true,
            itemStyle: {
              color: '#FFEB3B',
              borderColor: '#FFFFFF',
              borderWidth: 1,
            },
          },
          markLine: {
            symbol: 'none',
            lineStyle: {
              color: '#D98963',
              type: 'dashed',
              width: 1,
            },
            label: {
              show: true,
              position: 'end',
              align: 'right',
              color: '#D9D5CC',
              fontSize: 9,
              formatter: 'Objetivo (Bajo 80)',
            },
            data: [{ yAxis: 80 }],
          },
        },
        {
          id: 'heart-rate-series',
          name: 'Pulso',
          type: 'line',
          data: seriesData.heartRate,
          smooth: true,
          connectNulls: false,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          sampling: 'lttb',
          large: true,
          largeThreshold: 400,
          hoverLayerThreshold: 1000,
          itemStyle: { color: '#F44336' },
          lineStyle: {
            color: '#F44336',
            width: 1.8,
          },
          emphasis: {
            focus: 'series',
            scale: true,
            itemStyle: {
              color: '#FFEB3B',
              borderColor: '#FFFFFF',
              borderWidth: 1,
            },
          },
        },
      ],
    }),
    [seriesData],
  )

  return (
    <View style={[styles.container, { width: chartWidth }]}>
      <View
        accessibilityRole="toolbar"
        accessibilityLabel="Mostrar u ocultar series del gráfico"
        style={styles.seriesControls}
      >
        {SERIES.map(({ name, color }) => {
          const selected = seriesVisibility[name]

          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityLabel={`${selected ? 'Ocultar' : 'Mostrar'} ${name}`}
              accessibilityState={{ selected }}
              onPress={() => toggleSeries(name)}
              style={({ pressed }) => [
                styles.seriesButton,
                selected && styles.seriesButtonSelected,
                pressed && styles.seriesButtonPressed,
              ]}
            >
              <View
                style={[
                  styles.seriesSwatch,
                  { backgroundColor: color },
                  !selected && styles.seriesSwatchHidden,
                ]}
              />
              <Text style={[styles.seriesLabel, !selected && styles.seriesLabelHidden]}>
                {name}
              </Text>
            </Pressable>
          )
        })}
      </View>
      <ECharts option={option} width={chartWidth} chartInstanceRef={chartInstanceRef} />
    </View>
  )
}

export function BloodPressureChart(props: Props) {
  return <BloodPressureChartComponent {...props} />
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#0D100B',
  },
  seriesControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 4,
  },
  seriesButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#454A41',
    borderRadius: 20,
  },
  seriesButtonSelected: {
    backgroundColor: '#24291F',
    borderColor: '#56604D',
  },
  seriesButtonPressed: {
    opacity: 0.72,
  },
  seriesSwatch: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  seriesSwatchHidden: {
    opacity: 0.35,
  },
  seriesLabel: {
    color: '#D9DDD4',
    fontSize: 12,
    fontWeight: '500',
  },
  seriesLabelHidden: {
    color: '#81877C',
  },
})
