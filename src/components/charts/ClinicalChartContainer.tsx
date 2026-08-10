import { useMemo } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'

import {
  ClinicalChart,
} from './ClinicalChart'

import {
  clinicalSeries,
} from './ClinicalChart/constants/clinicalSeries'

import type {
  ClinicalSeriesKey,
} from './ClinicalChart/types/ClinicalSeries'

import {
  getAvailableClinicalSeries,
} from './ClinicalChart/utils/getAvailableClinicalSeries'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

type Props = {
  records: BloodPressureRecord[]
  excludedSeriesKeys?: ClinicalSeriesKey[]
}

const PRIMARY_SERIES: ClinicalSeriesKey[] = [
  'systolic',
  'diastolic',
  'heartRate',
]

export function ClinicalChartContainer({
  records,
  excludedSeriesKeys = [],
}: Props) {
  const excludedKeys = useMemo(
    () => new Set(excludedSeriesKeys),
    [excludedSeriesKeys],
  )

  const available = useMemo(
    () =>
      getAvailableClinicalSeries(records)
        .filter(series =>
          !excludedKeys.has(series.key),
        ),
    [
      records,
      excludedKeys,
    ],
  )

  const selected = useMemo(
    () => {
      const primary =
        clinicalSeries.filter(
          series =>
            PRIMARY_SERIES.includes(
              series.key,
            ) &&
            !excludedKeys.has(
              series.key,
            ) &&
            available.some(
              item =>
                item.key === series.key,
            ),
        )

      if (primary.length > 0) {
        return primary
      }

      return available
    },
    [
      available,
      excludedKeys,
    ],
  )

  if (
    records.length === 0 ||
    selected.length === 0
  ) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartSection}>
        <ClinicalChart
          records={records}
          series={selected}
        />
      </View>
    </View>
  )
}

const styles =
  StyleSheet.create({
    container: {
      width: '100%',
    },

    chartSection: {
      width: '100%',
    },
  })
