import {
  CartesianChart,
  useChartPressState,
  useChartTransformState,
} from 'victory-native'

import {
  StyleSheet,
  View,
} from 'react-native'

import { Card } from '@/components/ui'

import { ClinicalChartGrid } from './ClinicalChartGrid'
import { ClinicalChartBackground } from './ClinicalChartBackground'
import { ClinicalChartSeries } from './ClinicalChartSeries'
import { ClinicalTargetLines } from './ClinicalTargetLines'
import { ClinicalTooltip } from './ClinicalTooltip'

import { clinicalSeries } from './constants/clinicalSeries'

import { ClinicalChartProps } from './types/ClinicalChartProps'

import { useClinicalChartData } from './hooks/useClinicalChartData'
import { useClinicalChartConfig } from './hooks/useClinicalChartConfig'
import { useClinicalTargetLines } from './hooks/useClinicalTargetLines'

import { getClinicalYKeys } from './utils/getClinicalYKeys'


export function ClinicalChart({
  records,
  series = clinicalSeries,
}: ClinicalChartProps) {

  const data =
    useClinicalChartData(
      records,
    )

  const config =
    useClinicalChartConfig(
      series,
    )

  const targets =
    useClinicalTargetLines(
      config.keys,
    )


  const press =
    useChartPressState<any>({
      x: '',
      y: {},
    })


  const transform =
    useChartTransformState({
      scaleX: 1,
      scaleY: 1,
    })


  return (
    <Card>

      <View style={styles.chart}>

        <CartesianChart

          data={data}

          xKey="date"

          yKeys={
            getClinicalYKeys(
              series,
            )
          }

          chartPressState={
            press.state
          }

          transformState={
            transform.state
          }

          transformConfig={{
            pan:{
              dimensions:'x',
            },
            pinch:{
              dimensions:'x',
            },
          }}

        >

        {({
          points,
          yScale,
          chartBounds,
        }) => (

          <>

            <ClinicalChartBackground
              chartBounds={
                chartBounds
              }
            />


            <ClinicalChartGrid
              chartBounds={
                chartBounds
              }
            />


            <ClinicalTargetLines
              target={
                targets
              }

              yScale={
                yScale
              }

              chartBounds={
                chartBounds
              }
            />


            <ClinicalChartSeries
              points={
                points
              }

              series={
                series
              }
            />


          </>

        )}

        </CartesianChart>


        <ClinicalTooltip
          visible={
            press.state.isActive.value
          }
          date={
            String(
              press.state.x.value.value,
            )
          }
          values={[]}
        />

      </View>

    </Card>
  )
}


const styles = StyleSheet.create({

  chart:{
    height:380,
  },

})
