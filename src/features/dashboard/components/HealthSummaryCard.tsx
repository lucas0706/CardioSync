import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'

import {
  useFocusEffect,
} from 'expo-router'

import {
  useCallback,
} from 'react'

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons'

import {
  Card,
  Text,
} from '@/components/ui'

import {
  useHealthSummary,
} from '@/features/healthConnect'

import { theme } from '@/theme'

function formatHoursMinutes(
  hours: number,
): string {
  const totalMinutes =
    Math.round(hours * 60)

  const hh =
    Math.floor(
      totalMinutes / 60,
    )

  const mm =
    totalMinutes % 60

  return `${hh} h ${mm} min`
}

function formatLastSync(
  value: string,
): string {
  const date =
    new Date(value)

  return date.toLocaleTimeString(
    'es-AR',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}

type ClinicalStatus = {
  label: string
  color: string
  bars: number
}

function getSleepStatus(
  hours: number,
): ClinicalStatus {
  if (hours >= 8) {
    return {
      label: 'Óptimo',
      color:
        theme.colors.success,
      bars: 8,
    }
  }

  if (hours >= 7) {
    return {
      label: 'Bueno',
      color: '#EAB308',
      bars: 6,
    }
  }

  if (hours >= 6) {
    return {
      label: 'Mejorable',
      color:
        theme.colors.warning,
      bars: 4,
    }
  }

  return {
    label: 'Bajo',
    color:
      theme.colors.danger,
    bars: 2,
  }
}

function getStepsStatus(
  steps: number,
): ClinicalStatus {
  if (steps >= 10000) {
    return {
      label: 'Óptimo',
      color:
        theme.colors.success,
      bars: 8,
    }
  }

  if (steps >= 7500) {
    return {
      label: 'Bueno',
      color: '#EAB308',
      bars: 6,
    }
  }

  if (steps >= 5000) {
    return {
      label: 'Mejorable',
      color:
        theme.colors.warning,
      bars: 4,
    }
  }

  return {
    label: 'Bajo',
    color:
      theme.colors.danger,
    bars: 2,
  }
}

function getExerciseStatus(
  minutes: number,
): ClinicalStatus {
  if (minutes >= 45) {
    return {
      label: 'Óptimo',
      color:
        theme.colors.success,
      bars: 8,
    }
  }

  if (minutes >= 30) {
    return {
      label: 'Bueno',
      color: '#EAB308',
      bars: 6,
    }
  }

  if (minutes >= 15) {
    return {
      label: 'Mejorable',
      color:
        theme.colors.warning,
      bars: 4,
    }
  }

  return {
    label: 'Bajo',
    color:
      theme.colors.danger,
    bars: 2,
  }
}

function ClinicalBars({
  status,
}: {
  status: ClinicalStatus
}) {
  return (
    <View style={styles.chart}>
      {Array.from({
        length: 8,
      }).map(
        (_, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height:
                  12 +
                  index * 4,
                backgroundColor:
                  index <
                  status.bars
                    ? status.color
                    : '#E5E7EB',
              },
            ]}
          />
        ),
      )}
    </View>
  )
}

type MetricRowProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  label: string
  value: string
  status: ClinicalStatus
}

function MetricRow({
  icon,
  label,
  value,
  status,
}: MetricRowProps) {
  return (
    <Card
      padded={false}
      style={styles.metricCard}
    >
      <View
        style={styles.metricLeft}
      >
        <View
          style={styles.iconContainer}
        >
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={
              theme.colors.primary
            }
          />
        </View>

        <View>
          <Text
            style={
              styles.metricLabel
            }
          >
            {label}
          </Text>

          <Text
            style={
              styles.metricValue
            }
          >
            {value}
          </Text>

          <Text
            style={[
              styles.status,
              {
                color:
                  status.color,
              },
            ]}
          >
            {status.label}
          </Text>
        </View>
      </View>

      <ClinicalBars
        status={status}
      />
    </Card>
  )
}

export function HealthSummaryCard() {
  const {
    summary,
    loading,
    reload,
  } = useHealthSummary()

  useFocusEffect(
    useCallback(() => {
      void reload()
    }, [reload]),
  )

  if (loading) {
    return (
      <Card>
        <ActivityIndicator />
      </Card>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text
            style={styles.title}
          >
            Salud integrada
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Datos sincronizados
            desde Health Connect
          </Text>
        </View>

        <MaterialCommunityIcons
          name="heart-pulse"
          size={28}
          color={
            theme.colors.primary
          }
        />
      </View>

      <MetricRow
        icon="sleep"
        label="Último sueño"
        value={formatHoursMinutes(
          summary.averageSleepHours,
        )}
        status={getSleepStatus(
          summary.averageSleepHours,
        )}
      />

      <MetricRow
        icon="walk"
        label="Pasos del día"
        value={String(
          summary.todaySteps,
        )}
        status={getStepsStatus(
          summary.todaySteps,
        )}
      />

      <MetricRow
        icon="run"
        label="Ejercicio hoy"
        value={`${summary.exerciseMinutesToday} min`}
        status={getExerciseStatus(
          summary.exerciseMinutesToday,
        )}
      />

      <View style={styles.bottomRow}>
        <Card
          padded={false}
          style={
            styles.smallCard
          }
        >
          <MaterialCommunityIcons
            name="heart"
            size={20}
            color={
              theme.colors.primary
            }
          />

          <Text
            style={
              styles.smallLabel
            }
          >
            FC promedio
          </Text>

          <Text
            style={
              styles.smallValue
            }
          >
            {
              summary.todayHeartRateAverage
            }
          </Text>
        </Card>

        <Card
          padded={false}
          style={
            styles.smallCard
          }
        >
          <MaterialCommunityIcons
            name="scale-bathroom"
            size={20}
            color={
              theme.colors.primary
            }
          />

          <Text
            style={
              styles.smallLabel
            }
          >
            Último peso
          </Text>

          <Text
            style={
              styles.smallValue
            }
          >
            {summary.latestWeightKg !==
            undefined
              ? `${summary.latestWeightKg.toFixed(
                  1,
                )} kg`
              : '--'}
          </Text>
        </Card>
      </View>

      <View
        style={
          styles.syncContainer
        }
      >
        <MaterialCommunityIcons
          name="sync"
          size={14}
          color={
            theme.colors.textSecondary
          }
        />

        <Text
          style={
            styles.syncText
          }
        >
          Última sincronización:{' '}
          {formatLastSync(
            summary.lastSyncAt,
          )}
        </Text>
      </View>
    </Card>
  )
}

const styles =
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor:
        theme.colors.border,
    },

    header: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },

    title: {
      fontFamily:
        theme.typography.bold,
      fontSize: 18,
      color:
        theme.colors.text,
    },

    subtitle: {
      marginTop: 2,
      fontSize: 12,
      color:
        theme.colors.textSecondary,
    },

    metricCard: {
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor:
        theme.colors.border,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    metricLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    iconContainer: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent:
        'center',
      backgroundColor:
        '#EFF6FF',
    },

    metricLabel: {
      fontSize: 12,
      color:
        theme.colors.textSecondary,
    },

    metricValue: {
      marginTop: 2,
      fontFamily:
        theme.typography.bold,
      fontSize: 20,
      color:
        theme.colors.text,
    },

    status: {
      marginTop: 4,
      fontSize: 12,
      fontFamily:
        theme.typography.semiBold,
    },

    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 3,
      height: 44,
    },

    bar: {
      width: 6,
      borderRadius: 99,
    },

    bottomRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 4,
    },

    smallCard: {
      flex: 1,
      padding: 14,
      borderWidth: 1,
      borderColor:
        theme.colors.border,
    },

    smallLabel: {
      marginTop: 8,
      fontSize: 12,
      color:
        theme.colors.textSecondary,
    },

    smallValue: {
      marginTop: 6,
      fontFamily:
        theme.typography.bold,
      fontSize: 24,
      color:
        theme.colors.text,
    },

    syncContainer: {
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor:
        theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    syncText: {
      fontSize: 12,
      color:
        theme.colors.textSecondary,
    },
  })
