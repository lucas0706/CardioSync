import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { useRouter } from 'expo-router'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  Card,
  FloatingActionButton,
  Screen,
  Text,
} from '@/components/ui'

import {
  MeasurementMeta,
  MetricCard,
  SectionHeader,
  StatusBadge,
} from '@/components/ui/v2'


import { BloodPressureClassifier } from '@/domain/clinical/classification'
import { WaveBackground } from '@/components/ui/WaveBackground'

import { BloodPressureSafetyWarning } from '@/features/measurements/components/BloodPressureSafetyWarning'

import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { measurementService } from '@/features/measurements/services/MeasurementService'


import { theme } from '@/theme'
import {
  useClinicalProfile,
} from '@/features/profile/hooks'

import { HealthSummaryCard }
  from '@/features/dashboard/components/HealthSummaryCard'

export function HomeV2Screen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const dashboard = useDashboard()

  const latestMeasurement =
    measurementService.getLatest()

  const classification =
    latestMeasurement?.systolic != null &&
    latestMeasurement?.diastolic != null
      ? BloodPressureClassifier.classify(
          latestMeasurement.systolic,
          latestMeasurement.diastolic,
        )
      : null

  const latestDateTime =
    dashboard.latestDateTime
      ? new Date(dashboard.latestDateTime)
      : null

  const latestDate =
    latestDateTime
      ? latestDateTime.toLocaleDateString(
          'es-AR',
          {
            day: '2-digit',
            month: 'short',
          },
        ).replace('.', '')
      : null

  const latestTime =
    latestDateTime
      ? latestDateTime.toLocaleTimeString(
          'es-AR',
          {
            hour: '2-digit',
            minute: '2-digit',
          },
        )
      : null

  const today =
    new Date().toLocaleDateString(
      'es-AR',
      {
        day: '2-digit',
        month: 'long',
      },
    )

  const {
    profile,
  } = useClinicalProfile()

  const profileName =
    profile?.name?.trim()

  const hour =
    new Date().getHours()

  const greeting =
    hour < 12
      ? 'Buenos días'
      : hour < 19
        ? 'Buenas tardes'
        : 'Buenas noches'

  const armLabel =
    latestMeasurement?.arm === 'left'
      ? 'Izquierdo'
      : latestMeasurement?.arm === 'right'
        ? 'Derecho'
        : latestMeasurement?.arm ?? null

  const positionLabel =
    latestMeasurement?.position === 'sitting'
      ? 'Sentado'
      : latestMeasurement?.position === 'standing'
        ? 'De pie'
        : latestMeasurement?.position === 'lying'
          ? 'Acostado'
          : latestMeasurement?.position ?? null

  return (
    <Screen>
      <ScrollView
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {profileName
              ? `${greeting}, ${profileName}`
              : greeting}
          </Text>

          <Text style={styles.subtitle}>
            Así está tu presión hoy
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.dateSelector}
        >
          <Text style={styles.dateLabel}>
            Hoy
          </Text>

          <Text style={styles.dateValue}>
            {today}
          </Text>

          <Text style={styles.dateChevron}>
            ›
          </Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.overline}>
            ÚLTIMA MEDICIÓN
          </Text>

          <Card style={styles.latestCard}>
            <View style={styles.metricRow}>
              <MetricCard
                label="SIS"
                value={
                  latestMeasurement?.systolic != null
                    ? String(
                        latestMeasurement.systolic,
                      )
                    : '--'
                }
                unit="mmHg"
                style={styles.metric}
              />

              <MetricCard
                label="DIA"
                value={
                  latestMeasurement?.diastolic != null
                    ? String(
                        latestMeasurement.diastolic,
                      )
                    : '--'
                }
                unit="mmHg"
                style={styles.metric}
              />

              <MetricCard
                label="FC"
                value={
                  latestMeasurement?.heartRate != null
                    ? String(
                        latestMeasurement.heartRate,
                      )
                    : '--'
                }
                unit="bpm"
                style={styles.metric}
              />
            </View>

            <View style={styles.statusRow}>
              <StatusBadge
                label={
                  classification?.label ??
                  'Sin mediciones'
                }
                color={
                  classification?.color ??
                  theme.colors.textSecondary
                }
              />
            </View>

            {classification &&
            classification.safetyWarnings.length > 0 ? (
              <BloodPressureSafetyWarning
                warnings={
                  classification.safetyWarnings
                }
              />
            ) : null}

            <MeasurementMeta
              time={
                latestDate && latestTime
                  ? `${latestDate} · ${latestTime}`
                  : null
              }
              arm={armLabel}
              position={positionLabel}
            />
          </Card>
        </View>

        <SectionHeader
          title="Resumen semanal"
          subtitle="Últimos 7 días"
          style={styles.summaryHeader}
        />

        <View style={styles.summaryRow}>
          <MetricCard
            label="SIS"
            value={
              dashboard.averageSystolic != null
                ? String(
                    dashboard.averageSystolic,
                  )
                : '--'
            }
            unit="promedio"
            style={styles.summaryCard}
          />

          <MetricCard
            label="DIA"
            value={
              dashboard.averageDiastolic != null
                ? String(
                    dashboard.averageDiastolic,
                  )
                : '--'
            }
            unit="promedio"
            style={styles.summaryCard}
          />

          <MetricCard
            label="FC"
            value={
              dashboard.averageHeartRate != null
                ? String(
                    dashboard.averageHeartRate,
                  )
                : '--'
            }
            unit="promedio"
            style={styles.summaryCard}
          />
        </View>


        <HealthSummaryCard />

        <WaveBackground />



        <View style={styles.bottomSpace} />
      </ScrollView>

      <FloatingActionButton
        bottomOffset={8}
        onPress={() =>
          router.push('/measurement/new')
        }
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 72,
    gap: theme.spacing.md,
  },

  header: {
    gap: theme.spacing.xs,
  },

  greeting: {
    fontFamily: theme.typography.bold,
    fontSize: 24,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },

  dateSelector: {
    minHeight: 40,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateLabel: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
  },

  dateValue: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },

  dateChevron: {
    fontFamily: theme.typography.regular,
    fontSize: 26,
    lineHeight: 26,
    color: theme.colors.textSecondary,
  },

  section: {
    gap: theme.spacing.sm,
  },

  overline: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.overline,
    letterSpacing: 0.8,
    color: theme.colors.textSecondary,
  },

  latestCard: {
    padding: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
  },

  metricRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  metric: {
    minHeight: 112,
  },

  statusRow: {
    marginTop: theme.spacing.md,
  },

  summaryHeader: {
    marginBottom: -theme.spacing.md,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  summaryCard: {
    minHeight: 88,
    paddingHorizontal: theme.spacing.sm,
  },

  testNavigation: {
    minHeight: 44,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  testNavigationText: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
  },

  bottomSpace: {
    height: theme.spacing.xs,
  },
})
