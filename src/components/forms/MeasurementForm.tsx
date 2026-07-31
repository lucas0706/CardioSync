import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Controller } from 'react-hook-form'

import { Text } from '@/components/ui'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { useMeasurementForm } from '@/features/measurements/hooks/useMeasurementForm'
import { measurementService } from '@/features/measurements/services/MeasurementService'

type Props = {
  onSaved?: () => void
}

export function MeasurementForm({ onSaved }: Props) {
  const {
    control,
    handleSubmit,
    reset,
  } = useMeasurementForm()

  const onSubmit = handleSubmit((data) => {
    const now = new Date().toISOString()

    const record: BloodPressureRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      dateTime: now,
      systolic: data.systolic,
      diastolic: data.diastolic,
      heartRate: data.heartRate,
      weight: data.weight,
      height: undefined,
      glucose: undefined,
      spo2: undefined,
      temperature: undefined,
      respiratoryRate: undefined,
      pain: undefined,
      notes: data.notes,
      arm: undefined,
      position: undefined,
      device: undefined,
      guideline: undefined,
      createdAt: now,
      updatedAt: now,
    }

    measurementService.create(record)

    reset({
      systolic: 120,
      diastolic: 80,
      heartRate: undefined,
      weight: undefined,
      notes: '',
    })

    onSaved?.()
  })

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="systolic"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Sistólica"
            value={field.value?.toString() ?? ''}
            onChangeText={(v) => field.onChange(Number(v))}
          />
        )}
      />

      <Controller
        control={control}
        name="diastolic"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Diastólica"
            value={field.value?.toString() ?? ''}
            onChangeText={(v) => field.onChange(Number(v))}
          />
        )}
      />

      <Controller
        control={control}
        name="heartRate"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Pulso"
            value={field.value?.toString() ?? ''}
            onChangeText={(v) =>
              field.onChange(v ? Number(v) : undefined)
            }
          />
        )}
      />

      <Controller
        control={control}
        name="weight"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="Peso"
            value={field.value?.toString() ?? ''}
            onChangeText={(v) =>
              field.onChange(v ? Number(v) : undefined)
            }
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.notes]}
            multiline
            placeholder="Notas"
            value={field.value ?? ''}
            onChangeText={field.onChange}
          />
        )}
      />

      <Pressable
        style={styles.button}
        onPress={onSubmit}
      >
        <Text>Guardar medición</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },

  notes: {
    minHeight: 110,
    textAlignVertical: 'top',
  },

  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
})
