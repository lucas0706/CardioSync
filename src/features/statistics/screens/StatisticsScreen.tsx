import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { useCallback, useRef } from 'react'

import {
  useFocusEffect,
} from 'expo-router'

import {
  Screen,
  Text,
  Card,
} from '@/components/ui'

import {
  StatisticsChartCard,
  StatisticsPeriodSelector,
  StatisticsDateRangeSelector,
  StatisticsSummaryGrid,
  StatisticsClassificationCard,
} from '@/features/statistics/components'

import {
  useStatistics,
} from '@/features/statistics/hooks'

import { theme } from '@/theme'

export default function StatisticsScreen() {
  const {
    measurements,
    filteredMeasurements,
    summary,
    filter,
    updateFilter,
  } = useStatistics()

  const scrollViewRef =
    useRef<ScrollView>(null)

  useFocusEffect(
    useCallback(() => {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: false,
        })
      })
    }, []),
  )

  if (measurements.length === 0) {
    return (
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title}>
            Estadísticas
          </Text>

          <Text style={styles.subtitle}>
            Análisis de tus mediciones
          </Text>
        </View>

        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            Todavía no hay registros
          </Text>

          <Text style={styles.emptyText}>
            Registrá una medición para comenzar
            a ver tu evolución y estadísticas.
          </Text>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Estadísticas
          </Text>

          <Text style={styles.subtitle}>
            Análisis de tus mediciones
          </Text>
        </View>

        <StatisticsPeriodSelector
          value={filter.period}
          onChange={period =>
            updateFilter({
              period,
            })
          }
        />

        {filter.period === 'custom' ? (
          <StatisticsDateRangeSelector
            startDate={filter.startDate}
            endDate={filter.endDate}
            onChange={(
              startDate,
              endDate,
            ) =>
              updateFilter({
                startDate,
                endDate,
              })
            }
          />
        ) : null}

        <View style={styles.section}>
          <Text style={styles.overline}>
            EVOLUCIÓN
          </Text>

          <Text style={styles.sectionTitle}>
            Presión arterial
          </Text>

          <StatisticsChartCard
            records={filteredMeasurements}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.overline}>
            RESUMEN
          </Text>

          <Text style={styles.sectionTitle}>
            Valores principales
          </Text>

          <StatisticsSummaryGrid
            summary={summary}
          />
        </View>

        <StatisticsClassificationCard
          distribution={
            summary.classificationDistribution
          }
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingBottom:
      theme.spacing.xl * 2,
  },

  header: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    paddingBottom:
      theme.spacing.lg,
  },

  title: {
    fontFamily:
      theme.typography.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    lineHeight: 22,
    color:
      theme.colors.textSecondary,
  },

  section: {
    marginTop: theme.spacing.md,
  },

  overline: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.overline,
    letterSpacing: 0.6,
    color:
      theme.colors.textSecondary,
    marginBottom:
      theme.spacing.xs,
  },

  sectionTitle: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.title,
    lineHeight: 25,
    color:
      theme.colors.text,
    marginBottom:
      theme.spacing.sm,
  },

  emptyCard: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },

  emptyTitle: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.title,
  },

  emptyText: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    lineHeight: 22,
    color:
      theme.colors.textSecondary,
  },
})
