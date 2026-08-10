import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  ClinicalLegend,
} from './ClinicalLegend'

import {
  ClinicalChart,
} from './ClinicalChart'

import {
  clinicalSeries,
} from './constants/clinicalSeries'

import type {
  ClinicalSeries,
} from './types/ClinicalSeries'

import {
  getAvailableClinicalSeries,
} from './utils/getAvailableClinicalSeries'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

type Props = {
  records: BloodPressureRecord[]
}

const PRESSURE_KEYS: ClinicalSeries['key'][] = [
  'systolic',
  'diastolic',
]

const HEART_RATE_KEYS: ClinicalSeries['key'][] = [
  'heartRate',
]

function includesKey(
  series: ClinicalSeries[],
  key: ClinicalSeries['key'],
): boolean {
  return series.some(
    item => item.key === key,
  )
}

function filterSeries(
  series: ClinicalSeries[],
  keys: ClinicalSeries['key'][],
): ClinicalSeries[] {
  return series.filter(
    item => keys.includes(item.key),
  )
}

export function ClinicalChartContainer({
  records,
}: Props) {
  const available =
    getAvailableClinicalSeries(
      records,
    )

  const [
    selected,
    setSelected,
  ] = useState<ClinicalSeries[]>(
    available.length
      ? available
      : clinicalSeries,
  )

  function toggle(
    item: ClinicalSeries,
  ) {
    const exists =
      selected.some(
        current =>
          current.key === item.key,
      )

    if (exists) {
      setSelected(
        selected.filter(
          current =>
            current.key !== item.key,
        ),
      )

      return
    }

    setSelected([
      ...selected,
      item,
    ])
  }

  const pressureSeries =
    filterSeries(
      selected,
      PRESSURE_KEYS,
    )

  const heartRateSeries =
    filterSeries(
      selected,
      HEART_RATE_KEYS,
    )

  const hasPressure =
    pressureSeries.length > 0

  const hasHeartRate =
    heartRateSeries.length > 0

  const otherSeries =
    selected.filter(
      item =>
        !PRESSURE_KEYS.includes(
          item.key,
        ) &&
        !HEART_RATE_KEYS.includes(
          item.key,
        ),
    )

  return (
    <View style={styles.container}>
      <ClinicalLegend
        available={available}
        selected={selected}
        onToggle={toggle}
      />

      {hasPressure ? (
        <View style={styles.chartSection}>
          <ClinicalChart
            records={records}
            series={pressureSeries}
          />
        </View>
      ) : null}

      {hasHeartRate ? (
        <View style={styles.chartSection}>
          <ClinicalChart
            records={records}
            series={heartRateSeries}
          />
        </View>
      ) : null}

      {otherSeries.length > 0 ? (
        <View style={styles.chartSection}>
          <ClinicalChart
            records={records}
            series={otherSeries}
          />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  chartSection: {
    width: '100%',
  },
})
