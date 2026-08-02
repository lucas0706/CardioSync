import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  AppButton,
  AppSelectField,
  AppTextField,
} from '@/components/form'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { useMeasurementForm } from '@/features/measurements/hooks/useMeasurementForm'
import {
  createMeasurement,
  updateMeasurement,
} from '@/features/measurements/mappers/createMeasurement'
import {
  MeasurementFormData,
} from '@/features/measurements/schema/measurement.schema'
import { measurementService } from '@/features/measurements/services/MeasurementService'
import { formatDateTime } from '@/utils/date'

type Props = {
  onSaved?: (record?: BloodPressureRecord) => void
  mode?: 'create' | 'edit'
  initialValues?: Partial<MeasurementFormData>
  existingRecord?: BloodPressureRecord
}

export function MeasurementForm({
  onSaved,
  mode = 'create',
  initialValues,
  existingRecord,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useMeasurementForm(initialValues)

  const [displayDate, setDisplayDate] = useState('')
  const watchedDateTime = watch('dateTime')

  useEffect(() => {
    if (!watchedDateTime) {
      setDisplayDate('')
      return
    }

    const nextDisplayDate = formatDateTime(watchedDateTime)
    if (nextDisplayDate !== displayDate) {
      setDisplayDate(nextDisplayDate)
    }
  }, [watchedDateTime, displayDate])

  const parsedDateTime = useMemo(() => {
    if (!watchedDateTime) {
      return ''
    }

    const parsed = new Date(watchedDateTime)
    if (Number.isNaN(parsed.getTime())) {
      return ''
    }

    return parsed.toISOString()
  }, [watchedDateTime])

  const submit = handleSubmit(
    async (values) => {
      const normalizedValues = {
        ...values,
        dateTime: values.dateTime ?? parsedDateTime,
      }

      let measurement: BloodPressureRecord

      if (mode === 'edit' && existingRecord) {
        measurement = updateMeasurement(
          normalizedValues,
          existingRecord,
        )
        measurementService.update(measurement)
      } else {
        measurement = createMeasurement(normalizedValues)
        measurementService.create(measurement)
      }

      reset()

      onSaved?.(measurement)
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
        name="dateTime"
        label="Fecha y hora"
        placeholder="DD/MM/AAAA - HH:mm"
        value={displayDate}
        onChangeText={(text) => {
          setDisplayDate(text)

          const parsed = new Date(text)
          if (!Number.isNaN(parsed.getTime())) {
            setValue('dateTime', parsed.toISOString(), {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        }}
        error={errors.dateTime?.message}
      />

      <AppTextField
        control={control}
        name="heartRate"
        label="Frecuencia cardíaca"
        keyboardType="number-pad"
        error={errors.heartRate?.message}
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
        name="notes"
        label="Notas"
        multiline
        numberOfLines={4}
        error={errors.notes?.message}
      />

      <AppButton
        title={mode === 'edit' ? 'Guardar cambios' : 'Guardar medición'}
        onPress={submit}
        loading={isSubmitting}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
})
