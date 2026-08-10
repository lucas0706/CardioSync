import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  ClinicalLegend,
} from './ClinicalChart/ClinicalLegend'

import {
  ClinicalChart,
} from './ClinicalChart'

import {
  clinicalSeries,
} from './ClinicalChart/constants/clinicalSeries'

import type {
  ClinicalSeries,
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
      getAvailableClinicalSeries(
        records,
      ).filter(
        (series) =>
          !excludedKeys.has(series.key),
      ),
    [
      records,
      excludedKeys,
    ],
  )

  const fallbackSeries = useMemo(
    () =>
      clinicalSeries.filter(
        (series) =>
          !excludedKeys.has(series.key),
      ),
    [excludedKeys],
  )

  const [
    selected,
    setSelected,
  ] = useState<ClinicalSeries[]>(
    available.length
      ? available
      : fallbackSeries,
  )

  function toggle(
    item: ClinicalSeries,
  ) {
    const exists =
      selected.some(
        (current) =>
          current.key === item.key,
      )

    if (exists) {
      setSelected(
        selected.filter(
          (current) =>
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

  return (
    <View style={styles.container}>
      <ClinicalLegend
        available={available}
        selected={selected}
        onToggle={toggle}
      />

      <ClinicalChart
        records={records}
        series={selected}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
})
