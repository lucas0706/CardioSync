import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { router } from 'expo-router'

import Ionicons from '@expo/vector-icons/Ionicons'

import {
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
          <View style={styles.iconContainer}>
            <Ionicons
              name="trash-outline"
              size={42}
              color={theme.colors.danger}
            />
          </View>

          <Text
            variant="h1"
            style={styles.title}
          >
            Borrar mediciones
          </Text>

          <Text style={styles.description}>
            Esta acción eliminará permanentemente
            todas las mediciones almacenadas en
            CardioSync.
          </Text>

          <View style={styles.warningBox}>
            <Ionicons
              name="warning-outline"
              size={20}
              color={theme.colors.danger}
            />

            <Text style={styles.warningText}>
              Esta acción no se puede deshacer.
              Si deseás conservar los datos,
              realizá una copia de seguridad antes
              de continuar.
            </Text>
          </View>

          <Pressable
            style={styles.deleteButton}
            onPress={handleClear}
          >
            <Text style={styles.deleteButtonText}>
              Borrar todas las mediciones
            </Text>
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>
              Cancelar
            </Text>
          </Pressable>
        </Card>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  title: {
    textAlign: 'center',
  },

  description: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },

  warningBox: {
    marginTop: theme.spacing.lg,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  warningText: {
    flex: 1,
    color: theme.colors.danger,
  },

  deleteButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.danger,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },

  deleteButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.semiBold,
  },

  cancelButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  cancelButtonText: {
    color: theme.colors.text,
    fontFamily: theme.typography.semiBold,
  },
})
