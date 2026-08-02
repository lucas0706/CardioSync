import { ScrollView, StyleSheet } from 'react-native'

import {
  Screen,
  SectionTitle,
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

import { useStatistics } from '@/features/statistics/hooks'

export default function StatisticsScreen() {
  const {
    measurements,
    filteredMeasurements,
    summary,
    filter,
    updateFilter,
  } = useStatistics()

  if (measurements.length === 0) {
    return (
      <Screen>
        <SectionTitle
          title="Estadísticas"
          subtitle="Resumen clínico"
        />

        <Card>
          <Text variant="title">
            Sin registros
          </Text>

          <Text>
            Registrá una medición para comenzar.
          </Text>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle
          title="Estadísticas"
          subtitle="Análisis clínico"
        />

        <StatisticsPeriodSelector
          value={filter.period}
          onChange={(period) =>
            updateFilter({
              period,
            })
          }
        />

        {filter.period === 'custom' ? (
          <StatisticsDateRangeSelector
            startDate={filter.startDate}
            endDate={filter.endDate}
            onChange={(startDate, endDate) =>
              updateFilter({
                startDate,
                endDate,
              })
            }
          />
        ) : null}

        <StatisticsChartCard
          records={filteredMeasurements}
        />

        <StatisticsSummaryGrid
          summary={summary}
        />

        <StatisticsClassificationCard
          distribution={
            summary.classificationDistribution
          }
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({})
