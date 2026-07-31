import { ScrollView, StyleSheet, View } from 'react-native'
import { useState } from 'react'

import { Screen } from '@/components/ui'
import { MeasurementForm } from '@/components/forms/MeasurementForm'
import { MeasurementHistory } from '@/components/forms/MeasurementHistory'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

export default function HomeScreen() {
  const [refreshKey, setRefreshKey] = useState(0)

  const summary = useDashboard()

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
            value={
              summary.latestSystolic == null
                ? "--/--"
                : `${summary.latestSystolic}/${summary.latestDiastolic}`
            }
          />

          <SummaryCard
            title="Promedio"
            value={
              summary.totalMeasurements === 0
                ? "--/--"
                : `${summary.averageSystolic}/${summary.averageDiastolic}`
            }
          />

          <SummaryCard
            title="Registros"
            value={summary.totalMeasurements.toString()}
          />

          <SummaryCard
            title="Pulso"
            value={
              summary.averageHeartRate == null
                ? "--"
                : `${summary.averageHeartRate}`
            }
            subtitle="Promedio"
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
    gap: 20,
    paddingBottom: 40,
  },

  summary: {
    gap: 12,
  },
})
