import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  ClinicalChart,
} from './ClinicalChart/index'

import { ClinicalSeriesSelector } from './ClinicalSeriesSelector'

import { defaultClinicalSeries } from './constants/clinicalSeries'

import type {
  ClinicalSeries as LegacyClinicalSeries,
} from './types/ClinicalSeries'

import type {
  ClinicalSeries as V2ClinicalSeries,
} from './ClinicalChart/types/ClinicalSeries'

import {
  getAvailableClinicalSeries,
} from './utils/getAvailableClinicalSeries'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'


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
  ] = useState<LegacyClinicalSeries[]>(
    () =>
      availableSeries.length > 0
        ? availableSeries
        : defaultClinicalSeries,
  )


  const v2Series: V2ClinicalSeries[] = selectedSeries.map(
    series => ({
      ...series,
      symbol: 'circle',
    }),
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
        records={
          records
        }
        series={
          v2Series
        }
      />

    </View>
  )
}


const styles = StyleSheet.create({

  container:{
    gap:16,
  },

})
