import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { Screen, Text } from '@/components/ui'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { MeasurementDetail } from '@/features/measurements/components/MeasurementDetail'
import { MeasurementForm } from '@/features/measurements/components/MeasurementForm'
import { measurementService } from '@/features/measurements/services/MeasurementService'

export default function MeasurementDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [record, setRecord] = useState<BloodPressureRecord | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const existing = measurementService
      .getAll()
      .find((item) => item.id === id)

    setRecord(existing ?? null)
    setIsEditing(false)
  }, [id])

  const handleSaved = (updatedRecord?: BloodPressureRecord) => {
    if (updatedRecord) {
      setRecord(updatedRecord)
    } else {
      const existing = measurementService
        .getAll()
        .find((item) => item.id === id)

      setRecord(existing ?? null)
    }

    setIsEditing(false)
  }

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

        {isEditing ? (
          <MeasurementForm
            mode="edit"
            existingRecord={record}
            initialValues={{
              dateTime: record.dateTime,
              systolic: record.systolic,
              diastolic: record.diastolic,
              heartRate: record.heartRate,
              notes: record.notes ?? '',
              arm: record.arm,
              position: record.position,
            }}
            onSaved={handleSaved}
          />
        ) : (
          <MeasurementDetail
            record={record}
            onEdit={() => setIsEditing(true)}
          />
        )}
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
