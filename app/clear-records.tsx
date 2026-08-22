import {
  Alert,
  StyleSheet,
  View,
} from 'react-native'

import { router } from 'expo-router'

import {
  Button,
  Card,
  Screen,
  Text,
} from '@/components/ui'

import { measurementStore } from '@/features/measurements/services/MeasurementStore'
import { theme } from '@/theme'

export default function ClearRecordsScreen() {
  const handleClear = () => {
    Alert.alert(
      'Borrar todas las mediciones',
      'Esta acción eliminará todos los registros guardados en CardioSync. No se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: () => {
            measurementStore.clear()
            router.back()
          },
        },
      ],
    )
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Card>
          <Text variant="h1">
            Borrar mediciones
          </Text>

          <Text style={styles.description}>
            Esta acción eliminará todos los registros
            de presión arterial almacenados
            actualmente en CardioSync.
          </Text>

          <Text style={styles.warning}>
            Antes de continuar, asegurate de tener
            una copia de seguridad si necesitás
            conservar estos datos.
          </Text>

          <Button
            title="Borrar todas las mediciones"
            onPress={handleClear}
          />
        </Card>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },

  description: {
    marginTop: theme.spacing.sm,
  },

  warning: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    color: theme.colors.danger,
  },
})
