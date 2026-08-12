import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { Screen, Text } from '@/components/ui'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { MeasurementDetail } from '@/features/measurements/components/MeasurementDetail'
import { MeasurementForm } from '@/features/measurements/components/MeasurementForm'
import { measurementService } from '@/features/measurements/services/MeasurementService'
import { measurementStore } from '@/features/measurements/services/MeasurementStore'

export default function MeasurementDetailScreen() {
  const router = useRouter()

  const { id } =
    useLocalSearchParams<{
      id: string
    }>()

  const [
    record,
    setRecord,
  ] = useState<BloodPressureRecord | null>(
    null,
  )

  const [
    isEditing,
    setIsEditing,
  ] = useState(false)

  const scrollRef =
    useRef<ScrollView>(null)

  useEffect(() => {
    const existing =
      measurementService
        .getAll()
        .find(
          item => item.id === id,
        )

    setRecord(
      existing ?? null,
    )
    setIsEditing(false)
  }, [id])

  const handleNotesFocus = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      })
    }, 250)
  }

  const handleSaved = (
    updatedRecord?: BloodPressureRecord,
  ) => {
    if (updatedRecord) {
      setRecord(updatedRecord)
    } else {
      const existing =
        measurementService
          .getAll()
          .find(
            item => item.id === id,
          )

      setRecord(
        existing ?? null,
      )
    }

    setIsEditing(false)
  }

  const handleDelete = () => {
    Alert.alert(
      '¿Eliminar esta medición?',
      '',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            if (record?.id) {
              measurementStore.delete(
                record.id,
              )

              router.back()
            }
          },
        },
      ],
    )
  }

  if (!record) {
    return (
      <Screen>
        <View
          style={styles.emptyState}
        >
          <Text>
            No se encontró la medición.
          </Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        {isEditing ? (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={
              styles.scrollContent
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View
              style={styles.header}
            >
              <Text
                style={styles.backText}
                onPress={() =>
                  router.back()
                }
              >
                ← Volver
              </Text>
            </View>

            <MeasurementForm
              mode="edit"
              existingRecord={record}
              initialValues={{
                dateTime:
                  record.dateTime,
                systolic:
                  record.systolic,
                diastolic:
                  record.diastolic,
                heartRate:
                  record.heartRate ??
                  undefined,
                notes:
                  record.notes ?? '',
                arm: record.arm,
                position:
                  record.position,
              }}
              onNotesFocus={
                handleNotesFocus
              }
              onSaved={
                handleSaved
              }
            />
          </ScrollView>
        ) : (
          <>
            <View
              style={styles.header}
            >
              <Text
                style={styles.backText}
                onPress={() =>
                  router.back()
                }
              >
                ← Volver
              </Text>
            </View>

            <MeasurementDetail
              record={record}
              onEdit={() =>
                setIsEditing(true)
              }
              onDelete={
                handleDelete
              }
            />
          </>
        )}
      </KeyboardAvoidingView>
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

  scrollContent: {
    paddingBottom: 48,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
