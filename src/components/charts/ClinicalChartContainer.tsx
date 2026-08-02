import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { ClinicalSeriesSelector } from './ClinicalSeriesSelector'
import { defaultClinicalSeries } from './constants/clinicalSeries'
import { ClinicalChart } from './ClinicalChart'
import { ClinicalSeries } from './types/ClinicalSeries'
import { getAvailableClinicalSeries } from './utils/getAvailableClinicalSeries'

import { ClinicalTargets } from '@/clinical/targets'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

type Props = {
  records: BloodPressureRecord[]
}

export function ClinicalChartContainer({
  records,
}: Props) {
  const availableSeries =
    getAvailableClinicalSeries(
      records,
    )

  const [
    selectedSeries,
    setSelectedSeries,
  ] = useState<ClinicalSeries[]>(
    () =>
      availableSeries.length > 0
        ? availableSeries
        : defaultClinicalSeries,
  )

  return (
    <View style={styles.container}>
      <ClinicalSeriesSelector
        availableSeries={
          availableSeries
        }
        selectedSeries={
          selectedSeries
        }
        onChange={
          setSelectedSeries
        }
      />

      <ClinicalChart
        records={records}
        target={
          ClinicalTargets.default
        }
        series={
          selectedSeries
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
})
