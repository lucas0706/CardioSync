import { StyleSheet, View } from 'react-native'

import {
  AppBooleanField,
  AppButton,
  AppSelectField,
  AppTextField,
} from '@/components/form'
import { createMeasurement } from '@/features/measurements/mappers/createMeasurement'
import { useMeasurementForm } from '@/features/measurements/hooks/useMeasurementForm'
import { measurementService } from '@/features/measurements/services/MeasurementService'

type Props = {
  onSaved?: () => void
}

export function MeasurementForm({
  onSaved,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useMeasurementForm()

  const submit = handleSubmit(
    async (values) => {
      const measurement =
        createMeasurement(values)

      measurementService.create(
        measurement,
      )

      reset()

      onSaved?.()
    },
  )

  return (
    <View style={styles.container}>
      <AppTextField
        control={control}
        name="systolic"
        label="Presión sistólica"
        keyboardType="number-pad"
        error={errors.systolic?.message}
      />

      <AppTextField
        control={control}
        name="diastolic"
        label="Presión diastólica"
        keyboardType="number-pad"
        error={errors.diastolic?.message}
      />

      <AppTextField
        control={control}
        name="heartRate"
        label="Frecuencia cardíaca"
        keyboardType="number-pad"
        error={errors.heartRate?.message}
      />

      <AppTextField
        control={control}
        name="weight"
        label="Peso"
        keyboardType="decimal-pad"
        error={errors.weight?.message}
      />

      <AppSelectField
        control={control}
        name="arm"
        label="Brazo utilizado"
        options={[
          {
            label: 'Izquierdo',
            value: 'left',
          },
          {
            label: 'Derecho',
            value: 'right',
          },
        ]}
        error={errors.arm?.message}
      />

      <AppSelectField
        control={control}
        name="position"
        label="Posición"
        options={[
          {
            label: 'Sentado',
            value: 'sitting',
          },
          {
            label: 'De pie',
            value: 'standing',
          },
          {
            label: 'Acostado',
            value: 'lying',
          },
        ]}
        error={errors.position?.message}
      />

      <AppTextField
        control={control}
        name="context"
        label="Contexto"
        error={errors.context?.message}
      />

      <AppTextField
        control={control}
        name="symptoms"
        label="Síntomas"
        multiline
        numberOfLines={3}
        error={errors.symptoms?.message}
      />

      <AppBooleanField
        control={control}
        name="medicationTaken"
        label="¿Tomó medicación?"
        error={errors.medicationTaken?.message}
      />

      <AppTextField
        control={control}
        name="medicationName"
        label="Medicamento tomado"
        error={errors.medicationName?.message}
      />

      <AppTextField
        control={control}
        name="notes"
        label="Notas"
        multiline
        numberOfLines={4}
        error={errors.notes?.message}
      />

      <AppButton
        title="Guardar medición"
        onPress={submit}
        loading={isSubmitting}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
})
