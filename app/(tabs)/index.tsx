
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Button, Card, FloatingActionButton, Screen, Text } from '@/components/ui'
import { ClinicalSeriesSelector } from '@/components/charts/ClinicalSeriesSelector'

import { getAvailableClinicalSeries } from '@/components/charts/utils/getAvailableClinicalSeries'
import { ClinicalSeries } from '@/components/charts/types/ClinicalSeries'

import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { LatestMeasurementCard } from '@/features/dashboard/components/LatestMeasurementCard'
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'
import { theme } from '@/theme'
import { formatDateTime } from '@/utils/date'

export default function HomeScreen() {
  const summary = useDashboard()
  const { measurements } = useMeasurements()
  const router = useRouter()

  const hasMeasurements = summary.totalMeasurements > 0

  const lastUpdated = formatDateTime(measurements[0]?.dateTime)

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
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
            Resumen clínico
          </Text>
          <Text style={styles.sectionSubtitle}>
            Información clave de tu seguimiento
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <SummaryCard
              title="Promedio semanal"
              value={
                summary.totalMeasurements === 0
                  ? '--/--'
                  : `${summary.averageSystolic}/${summary.averageDiastolic}`
              }
              subtitle="Media de tus registros"
            />
          </View>

          <View style={styles.summaryItem}>
            <SummaryCard
              title="Cantidad de registros"
              value={summary.totalMeasurements.toString()}
              subtitle="Mediciones guardadas"
            />
          </View>

          <View style={styles.summaryItem}>
            <SummaryCard
              title="Última actualización"
              value={lastUpdated}
              subtitle="Registro más reciente"
            />
          </View>
        </View>

        {!hasMeasurements ? (
          <Card>
            <View style={styles.emptyState}>
              <Text variant="title" style={styles.emptyTitle}>
                Aún no registraste mediciones
              </Text>
              <Text style={styles.emptyText}>
                Registra tu primera toma para empezar a ver tu resumen clínico y seguir tu presión de forma sencilla.
              </Text>
              <Button
                title="Registrar primera medición"
                onPress={() => router.push('/measurement/new')}
              />
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
    gap: 12,
    paddingBottom: 12,
  },

  heroSection: {
    marginTop: 2,
  },

  sectionHeader: {
    gap: 2,
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
