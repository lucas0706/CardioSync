import { useEffect, useState } from 'react'

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'

import {
  Screen,
  Text,
} from '@/components/ui'

import { theme } from '@/theme'

import {
  getHealthConnectSettings,
  setHealthConnectEnabled,
} from '@/features/healthConnect/services/HealthConnectSettingsService'

import {
  healthConnectService,
} from '@/features/healthConnect/services/HealthConnectService'

import {
  healthConnectSyncService,
} from '@/features/healthConnect/services/HealthConnectSyncService'

import {
  measurementStore,
} from '@/features/measurements/services/MeasurementStore'

export default function HealthConnectScreen() {
  const [enabled, setEnabled] =
    useState(false)

  const [recordCount, setRecordCount] =
    useState(0)

  useEffect(() => {
    measurementStore.initialize()
    const settings =
      getHealthConnectSettings()

    setEnabled(settings.enabled)

    setRecordCount(
      measurementStore.getSnapshot()
        .length,
    )
  }, [])

  const handleConnect =
    async () => {
      const initialized =
        await healthConnectService.initialize()

      if (!initialized) {
        Alert.alert(
          'Health Connect',
          'Health Connect no está disponible.',
        )

        return
      }

      const granted =
        await healthConnectService
          .requestPermissions()

      if (!granted) {
        Alert.alert(
          'Health Connect',
          'No se otorgaron permisos.',
        )

        return
      }

      setHealthConnectEnabled(true)
      setEnabled(true)

      Alert.alert(
        'Health Connect',
        'Conectado correctamente.',
      )
    }

  const handleDisconnect =
    () => {
      setHealthConnectEnabled(false)

      setEnabled(false)

      Alert.alert(
        'Health Connect',
        'Conexión eliminada.',
      )
    }

  const handleSyncHistory =
    async () => {
      const records =
        measurementStore.getSnapshot()

      const exported =
        await healthConnectSyncService
          .exportAllBloodPressure(
            records,
          )

      Alert.alert(
        'Health Connect',
        `${exported} mediciones exportadas.`,
      )
    }

  const handleDeleteHistory =
    () => {
      Alert.alert(
        'Eliminar registros',
        'Se eliminarán todos los registros exportados por CardioSync.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              const deleted =
                await healthConnectSyncService
                  .deleteCardioSyncRecords()

              Alert.alert(
                'Health Connect',
                `${deleted} registros eliminados.`,
              )
            },
          },
        ],
      )
    }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Health Connect
            </Text>

            <Text style={styles.subtitle}>
              Sincronizá tus mediciones de
              presión arterial con Google
              Health Connect.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>
            ESTADO
          </Text>

          <View style={styles.card}>
            <View
              style={styles.cardContent}
            >
              <View
                style={styles.iconContainer}
              >
                <Ionicons
                  name="heart-outline"
                  size={24}
                  color={
                    theme.colors.primary
                  }
                />
              </View>

              <View
                style={styles.textContent}
              >
                <Text
                  style={styles.cardTitle}
                >
                  Estado de conexión
                </Text>

                <Text
                  style={
                    styles.cardDescription
                  }
                >
                  {enabled
                    ? 'Health Connect conectado'
                    : 'Health Connect desconectado'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>
            DATOS
          </Text>

          <View style={styles.card}>
            <View
              style={styles.cardContent}
            >
              <View
                style={styles.iconContainer}
              >
                <Ionicons
                  name="analytics-outline"
                  size={24}
                  color={
                    theme.colors.primary
                  }
                />
              </View>

              <View
                style={styles.textContent}
              >
                <Text
                  style={styles.cardTitle}
                >
                  Mediciones locales
                </Text>

                <Text
                  style={
                    styles.cardDescription
                  }
                >
                  {recordCount} registros
                  almacenados
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>
            ACCIONES
          </Text>

          {!enabled ? (
            <Pressable
              style={styles.primaryButton}
              onPress={handleConnect}
            >
              <Ionicons
                name="link-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Conectar Health Connect
              </Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={styles.primaryButton}
                onPress={
                  handleSyncHistory
                }
              >
                <Ionicons
                  name="sync-outline"
                  size={20}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Sincronizar historial
                </Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={
                  handleDisconnect
                }
              >
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color={
                    theme.colors.primary
                  }
                />

                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  Desconectar
                </Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={
                  handleDeleteHistory
                }
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#DC2626"
                />

                <Text
                  style={[
                    styles.secondaryButtonText,
                    {
                      color: '#DC2626',
                    },
                  ]}
                >
                  Eliminar registros
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    paddingBottom: 40,
  },

  header: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },

  title: {
    fontFamily:
      theme.typography.bold,
    fontSize: 28,
    color: theme.colors.text,
  },

  subtitle: {
    color:
      theme.colors.textSecondary,
  },

  sectionLabel: {
    fontFamily:
      theme.typography.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    color:
      theme.colors.textSecondary,
  },

  card: {
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
  },

  cardContent: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      theme.colors.primary + '12',
  },

  textContent: {
    flex: 1,
  },

  cardTitle: {
    fontFamily:
      theme.typography.semiBold,
  },

  cardDescription: {
    color:
      theme.colors.textSecondary,
  },

  primaryButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.primary,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily:
      theme.typography.semiBold,
  },

  secondaryButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.surface,
  },

  secondaryButtonText: {
    fontFamily:
      theme.typography.semiBold,
  },
})
