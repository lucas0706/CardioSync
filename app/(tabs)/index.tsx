import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Card, FloatingActionButton, Screen, Text } from '@/components/ui'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { LatestMeasurementCard } from '@/features/dashboard/components/LatestMeasurementCard'
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { theme } from '@/theme'

export default function HomeScreen() {
  const summary = useDashboard()
  const router = useRouter()
  const hasMeasurements = summary.totalMeasurements > 0

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader />

        <View style={styles.heroSection}>
          <LatestMeasurementCard
            systolic={summary.latestSystolic}
            diastolic={summary.latestDiastolic}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text variant="title" style={styles.sectionTitle}>
            Resumen rápido
          </Text>
          <Text style={styles.sectionSubtitle}>
            Información clave de tu seguimiento
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <SummaryCard
              title="Promedio"
              value={
                summary.totalMeasurements === 0
                  ? "--/--"
                  : `${summary.averageSystolic}/${summary.averageDiastolic}`
              }
            />
          </View>

          <View style={styles.summaryItem}>
            <SummaryCard
              title="Registros"
              value={summary.totalMeasurements.toString()}
            />
          </View>

          <View style={styles.summaryItem}>
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
        </View>

        {!hasMeasurements ? (
          <Card>
            <View style={styles.emptyState}>
              <Text variant="title" style={styles.emptyTitle}>
                Tu seguimiento está listo para comenzar
              </Text>
              <Text style={styles.emptyText}>
                Guarda tu primera medición para ver aquí un resumen claro y ordenado.
              </Text>
            </View>
          </Card>
        ) : null}
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

  heroSection: {
    marginTop: 4,
  },

  sectionHeader: {
    gap: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },

  sectionSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },

  summaryGrid: {
    gap: 12,
  },

  summaryItem: {
    width: '100%',
  },

  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },

  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})
