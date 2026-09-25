import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import {
  useFocusEffect,
} from 'expo-router'

import {
  useCallback,
  useState,
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

import {
  ClinicalStatus,
  getExerciseStatus,
  getSleepStatus,
  getStepsStatus,
} from '@/domain/health/HealthClinicalRules'

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
                    : theme.colors.border,
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
  onPressInfo: () => void
}

function MetricRow({
  icon,
  label,
  value,
  status,
  onPressInfo,
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

          <View
            style={
              styles.statusRow
            }
          >
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

            <Pressable
              onPress={() =>
                onPressInfo()
              }
            >
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={14}
                color={
                  theme.colors.textSecondary
                }
              />
            </Pressable>
          </View>
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

  const [
    selectedClinicalInfo,
    setSelectedClinicalInfo,
  ] = useState<
    'sleep' |
    'steps' |
    'exercise' |
    null
  >(null)

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
        onPressInfo={() =>
          setSelectedClinicalInfo(
            'sleep',
          )
        }
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
        onPressInfo={() =>
          setSelectedClinicalInfo(
            'steps',
          )
        }
      />

      <MetricRow
        icon="run"
        label="Ejercicio hoy"
        value={`${summary.exerciseMinutesToday} min`}
        status={getExerciseStatus(
          summary.exerciseMinutesToday,
        )}
        onPressInfo={() =>
          setSelectedClinicalInfo(
            'exercise',
          )
        }
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

      <Modal
        visible={
          selectedClinicalInfo !==
          null
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setSelectedClinicalInfo(
            null,
          )
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor:
              'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Card>
            <Text
              style={{
                fontFamily:
                  theme.typography.bold,
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              Referencias clínicas
            </Text>

            {selectedClinicalInfo ===
            'sleep' ? (
              <Text
                style={{
                  marginBottom: 16,
                }}
              >
                American Academy of Sleep
                Medicine (AASM) y Sleep
                Research Society.
                {'\n\n'}
                Recomendación general:
                7 a 9 horas de sueño por
                noche para adultos.
                {'\n\n'}
                Clasificación utilizada:
                {'\n'}
                Óptimo ≥ 8 h
                {'\n'}
                Adecuado 7–7.9 h
                {'\n'}
                Mejorable 6–6.9 h
                {'\n'}
                Bajo &lt; 6 h
              </Text>
            ) : selectedClinicalInfo ===
              'steps' ? (
              <Text
                style={{
                  marginBottom: 16,
                }}
              >
                Paluch et al.
                The Lancet Public Health
                (2022).
                {'\n\n'}
                Beneficios observados desde
                aproximadamente 5.000 pasos
                diarios, con mejoras
                progresivas entre 7.500 y
                10.000 pasos.
                {'\n\n'}
                Clasificación utilizada:
                {'\n'}
                Óptimo ≥ 10.000
                {'\n'}
                Adecuado 7.500–9.999
                {'\n'}
                Mejorable 5.000–7.499
                {'\n'}
                Bajo &lt; 5.000
              </Text>
            ) : (
              <Text
                style={{
                  marginBottom: 16,
                }}
              >
                World Health Organization
                Physical Activity
                Guidelines (2020)
                y European Society of
                Cardiology Prevention
                Guidelines.
                {'\n\n'}
                Se recomienda realizar
                actividad física regular
                para mejorar la salud
                cardiovascular.
                {'\n\n'}
                Clasificación utilizada:
                {'\n'}
                Óptimo ≥ 45 min
                {'\n'}
                Adecuado 30–44 min
                {'\n'}
                Mejorable 15–29 min
                {'\n'}
                Bajo &lt; 15 min
              </Text>
            )}

            <Pressable
              onPress={() =>
                setSelectedClinicalInfo(
            null,
          )
              }
            >
              <Text
                style={{
                  color:
                    theme.colors.primary,
                  fontFamily:
                    theme.typography.semiBold,
                }}
              >
                Cerrar
              </Text>
            </Pressable>
          </Card>
        </View>
      </Modal>
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
      fontSize: 12,
      fontFamily:
        theme.typography.semiBold,
    },

    statusRow: {
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
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
