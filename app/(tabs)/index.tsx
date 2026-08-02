import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'

import { FloatingActionButton, Screen } from '@/components/ui'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { LatestMeasurementCard } from '@/features/dashboard/components/LatestMeasurementCard'
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

export default function HomeScreen() {
  const summary = useDashboard()
  const router = useRouter()

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader />

        <LatestMeasurementCard
          systolic={summary.latestSystolic}
          diastolic={summary.latestDiastolic}
        />

        <View style={styles.summary}>
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
      </ScrollView>

      <FloatingActionButton onPress={() => router.push('/measurement/new')} />
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
