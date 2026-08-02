import { useState } from 'react'
import { View, StyleSheet } from 'react-native'

import {
  ClinicalLegend,
} from './ClinicalLegend'

import {
  ClinicalChart,
} from './ClinicalChart'

import {
  clinicalSeries,
} from './constants/clinicalSeries'

import {
  ClinicalSeries,
} from './types/ClinicalSeries'

import {
  getAvailableClinicalSeries,
} from './utils/getAvailableClinicalSeries'

import {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

type Props = {
  records: BloodPressureRecord[]
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
  container:{
    gap:16,
  },
})
