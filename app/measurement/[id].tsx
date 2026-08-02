import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Screen, Text } from '@/components/ui'
import { MeasurementDetail } from '@/features/measurements/components/MeasurementDetail'
import { measurementService } from '@/features/measurements/services/MeasurementService'

export default function MeasurementDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const record = useMemo(() => {
    return measurementService.getAll().find((item) => item.id === id)
  }, [id])

  if (!record) {
    return (
      <Screen>
        <View style={styles.emptyState}>
          <Text>No se encontró la medición.</Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.backText} onPress={() => router.back()}>
            ← Volver
          </Text>
        </View>

        <MeasurementDetail record={record} />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginBottom: 16,
  },

  backText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
