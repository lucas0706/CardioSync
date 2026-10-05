import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import {
  ScreenHeader,
  Screen,
  Text,
} from '@/components/ui'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

import {
  MeasurementDetail,
} from '@/features/measurements/components/MeasurementDetail'

import {
  MeasurementForm,
} from '@/features/measurements/components/MeasurementForm'

import {
  measurementService,
} from '@/features/measurements/services/MeasurementService'

import {
  measurementStore,
} from '@/features/measurements/services/MeasurementStore'

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

  if (!record) {
    return (
      <Screen>
        <ScreenHeader
          title="Detalle de medición"
          subtitle="No se encontró la medición."
        />

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
      <ScreenHeader
        title={
          isEditing
            ? 'Editar medición'
            : 'Detalle de medición'
        }
        subtitle={
          isEditing
            ? 'Modificá los datos de este registro'
            : 'Presión arterial registrada'
        }
        leading={
          <Text
            style={styles.backText}
            onPress={() => {
              if (isEditing) {
                setIsEditing(false)
                return
              }

              router.back()
            }}
          >
            ← Volver
          </Text>
        }
      />

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
              styles.editScrollContent
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
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
            <MeasurementDetail
              record={record}
              onEdit={() =>
                setIsEditing(true)
              }
              onDelete={() => {
                if (!record) {
                  return
                }

                Alert.alert(
                  '¿Eliminar esta medición?',
                  'Esta acción no se puede deshacer.',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                    },
                    {
                      text: 'Eliminar',
                      style: 'destructive',
                      onPress: () => {
                        measurementStore.delete(
                          record.id,
                        )

                        router.back()
                      },
                    },
                  ],
                )
              }}
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

  backText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },

  editScrollContent: {
    paddingBottom: 80,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
