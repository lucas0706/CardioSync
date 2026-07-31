import { ScrollView, StyleSheet, View } from 'react-native'
import { useMemo, useState } from 'react'

import { Screen } from '@/components/ui'
import { MeasurementForm } from '@/components/forms/MeasurementForm'
import { MeasurementHistory } from '@/components/forms/MeasurementHistory'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'
import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

export default function HomeScreen() {
  const [refreshKey, setRefreshKey] = useState(0)

  const { measurements } = useMeasurements()

  const stats = useMemo(() => {
    if (measurements.length === 0) {
      return {
        total: 0,
        averageSys: '--',
        averageDia: '--',
        last: '--/--',
      }
    }

    const totalSys = measurements.reduce(
      (sum, item) => sum + item.systolic,
      0,
    )

    const totalDia = measurements.reduce(
      (sum, item) => sum + item.diastolic,
      0,
    )

    return {
      total: measurements.length,
      averageSys: Math.round(
        totalSys / measurements.length,
      ).toString(),
      averageDia: Math.round(
        totalDia / measurements.length,
      ).toString(),
      last: `${measurements[0].systolic}/${measurements[0].diastolic}`,
    }
  }, [measurements])

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader />

        <View style={styles.summary}>
          <SummaryCard
            title="Última"
            value={stats.last}
          />

          <SummaryCard
            title="Promedio"
            value={`${stats.averageSys}/${stats.averageDia}`}
          />

          <SummaryCard
            title="Registros"
            value={stats.total.toString()}
          />
        </View>

        <MeasurementForm
          onSaved={() => setRefreshKey((v) => v + 1)}
        />

        <MeasurementHistory
          refreshKey={refreshKey}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
    gap: 20,
  },

  summary: {
    gap: 12,
    marginBottom: 8,
  },
})
