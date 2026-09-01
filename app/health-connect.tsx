import { useEffect, useState } from 'react'

import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

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
  measurementService,
} from '@/features/measurements/services/MeasurementService'

export default function HealthConnectScreen() {
  const [enabled, setEnabled] =
    useState(false)

  useEffect(() => {
    const settings =
      getHealthConnectSettings()

    setEnabled(settings.enabled)
  }, [])

  const handleConnect =
    async () => {
      const initialized =
        await healthConnectService.initialize()

      if (!initialized) {
        Alert.alert(
          'Health Connect',
          'Health Connect no está disponible en este dispositivo.',
        )

        return
      }

      const granted =
        await healthConnectService.requestPermissions()

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
        'Conexión realizada correctamente.',
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
        measurementService.getAll()

      console.log(
        '[HealthConnect] Records found',
        records.length,
      )

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

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>
          Health Connect
        </Text>

        <Text style={styles.status}>
          Estado:{' '}
          {enabled
            ? 'Conectado'
            : 'Desconectado'}
        </Text>

        {!enabled ? (
          <Pressable
            style={styles.button}
            onPress={handleConnect}
          >
            <Text style={styles.buttonText}>
              Conectar
            </Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={styles.button}
              onPress={handleDisconnect}
            >
              <Text style={styles.buttonText}>
                Desconectar
              </Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={handleSyncHistory}
            >
              <Text style={styles.buttonText}>
                Sincronizar historial
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
    fontFamily:
      theme.typography.bold,
    fontSize: 24,
    color: theme.colors.text,
  },

  status: {
    fontFamily:
      theme.typography.regular,
    color:
      theme.colors.textSecondary,
  },

  button: {
    alignItems: 'center',
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.primary,
    padding:
      theme.spacing.md,
  },

  buttonText: {
    color: '#FFFFFF',
    fontFamily:
      theme.typography.semiBold,
  },
})
