import { useEffect, useState } from 'react'

import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import {
  Card,
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
      <View style={styles.container}>
        <Text style={styles.title}>
          Health Connect
        </Text>

        <Text style={styles.subtitle}>
          Sincroniza tus mediciones con
          Google Health Connect.
        </Text>

        <Card>
          <Text style={styles.cardLabel}>
            Estado
          </Text>

          <Text
            style={[
              styles.status,
              enabled
                ? styles.connected
                : styles.disconnected,
            ]}
          >
            {enabled
              ? '● Conectado'
              : '● Desconectado'}
          </Text>
        </Card>

        <Card>
          <Text style={styles.cardLabel}>
            Mediciones almacenadas
          </Text>

          <Text style={styles.counter}>
            {recordCount}
          </Text>
        </Card>

        {!enabled ? (
          <Pressable
            style={styles.primaryButton}
            onPress={handleConnect}
          >
            <Text style={styles.buttonText}>
              Conectar Health Connect
            </Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={styles.primaryButton}
              onPress={handleSyncHistory}
            >
              <Text style={styles.buttonText}>
                Sincronizar historial
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={handleDisconnect}
            >
              <Text style={styles.buttonText}>
                Desconectar
              </Text>
            </Pressable>

            <Pressable
              style={styles.dangerButton}
              onPress={handleDeleteHistory}
            >
              <Text style={styles.buttonText}>
                Eliminar registros exportados
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  title: {
    fontSize: 28,
    color: theme.colors.text,
    fontFamily:
      theme.typography.bold,
  },

  subtitle: {
    color:
      theme.colors.textSecondary,
    fontFamily:
      theme.typography.regular,
  },

  cardLabel: {
    marginBottom: 8,
    color:
      theme.colors.textSecondary,
    fontFamily:
      theme.typography.semiBold,
  },

  status: {
    fontSize: 18,
    fontFamily:
      theme.typography.bold,
  },

  connected: {
    color: '#16A34A',
  },

  disconnected: {
    color: '#DC2626',
  },

  counter: {
    fontSize: 36,
    color: theme.colors.text,
    fontFamily:
      theme.typography.bold,
  },

  primaryButton: {
    alignItems: 'center',
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.primary,
    padding:
      theme.spacing.md,
  },

  secondaryButton: {
    alignItems: 'center',
    borderRadius:
      theme.radius.md,
    backgroundColor: '#6B7280',
    padding:
      theme.spacing.md,
  },

  dangerButton: {
    alignItems: 'center',
    borderRadius:
      theme.radius.md,
    backgroundColor: '#DC2626',
    padding:
      theme.spacing.md,
  },

  buttonText: {
    color: '#FFFFFF',
    fontFamily:
      theme.typography.semiBold,
  },
})
