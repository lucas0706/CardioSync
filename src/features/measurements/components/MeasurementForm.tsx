import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import {
  AppButton,
  AppSelectField,
} from '@/components/form'

import { Text } from '@/components/ui'

import { theme } from '@/theme'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

import {
  useMeasurementForm,
} from '@/features/measurements/hooks/useMeasurementForm'

import {
  createMeasurement,
  updateMeasurement,
} from '@/features/measurements/mappers/createMeasurement'

import type {
  MeasurementFormData,
} from '@/features/measurements/schema/measurement.schema'

import {
  measurementStore,
} from '@/features/measurements/services/MeasurementStore'

import {
  MeasurementMetricInputCard,
} from './v2/MeasurementMetricInputCard'

import {
  MeasurementOptionSelector,
} from './v2/MeasurementOptionSelector'

import {
  MeasurementDateTimeField,
} from './v2/MeasurementDateTimeField'

type Props = {
  onSaved?: (
    record?: BloodPressureRecord,
  ) => void

  onNotesFocus?: () => void

  mode?: 'create' | 'edit'

  initialValues?: Partial<MeasurementFormData>

  existingRecord?: BloodPressureRecord
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function getInitialDateParts(
  value?: string,
) {
  const date = value
    ? new Date(value)
    : new Date()

  if (Number.isNaN(date.getTime())) {
    const fallback = new Date()

    return {
      date: `${pad(
        fallback.getDate(),
      )}/${pad(
        fallback.getMonth() + 1,
      )}/${fallback.getFullYear()}`,

      time: `${pad(
        fallback.getHours(),
      )}:${pad(
        fallback.getMinutes(),
      )}`,
    }
  }

  return {
    date: `${pad(
      date.getDate(),
    )}/${pad(
      date.getMonth() + 1,
    )}/${date.getFullYear()}`,

    time: `${pad(
      date.getHours(),
    )}:${pad(
      date.getMinutes(),
    )}`,
  }
}

function formatDateInput(
  value: string,
): string {
  const digits =
    value
      .replace(/\D/g, '')
      .slice(0, 8)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 4) {
    return `${digits.slice(
      0,
      2,
    )}/${digits.slice(2)}`
  }

  return `${digits.slice(
    0,
    2,
  )}/${digits.slice(
    2,
    4,
  )}/${digits.slice(4)}`
}

function formatTimeInput(
  value: string,
): string {
  const digits =
    value
      .replace(/\D/g, '')
      .slice(0, 4)

  if (digits.length <= 2) {
    return digits
  }

  return `${digits.slice(
    0,
    2,
  )}:${digits.slice(2)}`
}

function buildDateTime(
  dateText: string,
  timeText: string,
): string | null {
  const dateMatch =
    /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(
      dateText,
    )

  const timeMatch =
    /^(\d{2}):(\d{2})$/.exec(
      timeText,
    )

  if (!dateMatch || !timeMatch) {
    return null
  }

  const day = Number(dateMatch[1])
  const month = Number(dateMatch[2])
  const year = Number(dateMatch[3])
  const hour = Number(timeMatch[1])
  const minute = Number(timeMatch[2])

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null
  }

  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0,
  )

  if (
    date.getFullYear() !== year ||
    date.getMonth() !==
      month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null
  }

  return date.toISOString()
}

export function MeasurementForm({
  onSaved,
  onNotesFocus,
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
  } = useMeasurementForm(
    initialValues,
  )

  const initialDateTime =
    useMemo(
      () =>
        getInitialDateParts(
          initialValues?.dateTime ??
            existingRecord?.dateTime,
        ),
      [
        initialValues?.dateTime,
        existingRecord?.dateTime,
      ],
    )

  const [
    dateText,
    setDateText,
  ] = useState(
    initialDateTime.date,
  )

  const [
    timeText,
    setTimeText,
  ] = useState(
    initialDateTime.time,
  )

  const [
    selectedDateTime,
    setSelectedDateTime,
  ] = useState(() => {
    const source =
      initialValues?.dateTime ??
      existingRecord?.dateTime

    const parsed = source
      ? new Date(source)
      : new Date()

    return Number.isNaN(
      parsed.getTime(),
    )
      ? new Date()
      : parsed
  })

  const systolic =
    watch('systolic')

  const diastolic =
    watch('diastolic')

  const heartRate =
    watch('heartRate')

  const updateDateTime = (
    nextDate: string,
    nextTime: string,
  ) => {
    const parsed =
      buildDateTime(
        nextDate,
        nextTime,
      )

    if (!parsed) {
      return
    }

    setValue(
      'dateTime',
      parsed,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
  }

  const handleDateChange = (
    value: string,
  ) => {
    const formatted =
      formatDateInput(value)

    setDateText(formatted)

    updateDateTime(
      formatted,
      timeText,
    )
  }

  const handleTimeChange = (
    value: string,
  ) => {
    const formatted =
      formatTimeInput(value)

    setTimeText(formatted)

    updateDateTime(
      dateText,
      formatted,
    )
  }

  const submit = handleSubmit(
    async values => {
      const dateTime =
        buildDateTime(
          dateText,
          timeText,
        )

      const normalizedValues = {
        ...values,
        dateTime:
          dateTime ??
          values.dateTime,
      }

      let measurement:
        BloodPressureRecord

      if (
        mode === 'edit' &&
        existingRecord
      ) {
        measurement =
          updateMeasurement(
            normalizedValues,
            existingRecord,
          )

        measurementStore.update(
          measurement,
        )
      } else {
        measurement =
          createMeasurement(
            normalizedValues,
          )

        measurementStore.create(
          measurement,
        )
      }

      reset()

      if (mode === 'create') {
        showSaveSuccessAnimation()

        setTimeout(() => {
          onSaved?.(measurement)
        }, 650)
      } else {
        onSaved?.(measurement)
      }
    },
  )

  const saveSuccessPulse = useRef(
    new Animated.Value(0),
  ).current

  const [showSaveSuccess, setShowSaveSuccess] =
    useState(false)

  const showSaveSuccessAnimation = () => {
    setShowSaveSuccess(true)
    saveSuccessPulse.setValue(0)

    Animated.sequence([
      Animated.timing(saveSuccessPulse, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(420),
      Animated.timing(saveSuccessPulse, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShowSaveSuccess(false)
      }
    })
  }

  const handleMetricChange = (
    field:
      | 'systolic'
      | 'diastolic'
      | 'heartRate',
    value: string,
  ) => {
    const digits =
      value.replace(/\D/g, '')

    if (!digits) {
      setValue(
        field,
        undefined,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      )
      return
    }

    const parsed =
      Number.parseInt(
        digits,
        10,
      )

    setValue(
      field,
      Number.isNaN(parsed)
        ? undefined
        : parsed,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === 'edit'
            ? 'Editar medición'
            : 'Nueva medición'}
        </Text>

        <Text style={styles.subtitle}>
          {mode === 'edit'
            ? 'Modificá los datos de este registro'
            : 'Registrá tu presión arterial'}
        </Text>
      </View>

      <View style={styles.metricsSection}>
        <Text style={styles.overline}>
          PRESIÓN ARTERIAL
        </Text>

        <View style={styles.metricRow}>
          <MeasurementMetricInputCard
            label="SIS"
            value={
              systolic != null
                ? String(systolic)
                : ''
            }
            unit="mmHg"
            onChangeText={value =>
              handleMetricChange(
                'systolic',
                value,
              )
            }
            error={undefined}
          />

          <MeasurementMetricInputCard
            label="DIA"
            value={
              diastolic != null
                ? String(diastolic)
                : ''
            }
            unit="mmHg"
            onChangeText={value =>
              handleMetricChange(
                'diastolic',
                value,
              )
            }
            error={undefined}
          />
        </View>

        <View style={styles.fcRow}>
          <MeasurementMetricInputCard
            label="FC"
            value={
              heartRate != null
                ? String(heartRate)
                : ''
            }
            unit="bpm"
            onChangeText={value =>
              handleMetricChange(
                'heartRate',
                value,
              )
            }
            error={undefined}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.overline}>
          FECHA Y HORA
        </Text>

        <View style={styles.dateTimeRow}>
          <MeasurementDateTimeField
            label="Fecha"
            value={selectedDateTime}
            mode="date"
            onChange={date => {
              const next = new Date(
                selectedDateTime,
              )

              next.setFullYear(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              )

              setSelectedDateTime(next)

              const formattedDate =
                `${String(
                  next.getDate(),
                ).padStart(2, '0')}/${String(
                  next.getMonth() + 1,
                ).padStart(2, '0')}/${next.getFullYear()}`

              setDateText(formattedDate)

              updateDateTime(
                formattedDate,
                timeText,
              )
            }}
          />

          <MeasurementDateTimeField
            label="Hora"
            value={selectedDateTime}
            mode="time"
            onChange={date => {
              const next = new Date(
                selectedDateTime,
              )

              next.setHours(
                date.getHours(),
                date.getMinutes(),
                0,
                0,
              )

              setSelectedDateTime(next)

              const formattedTime =
                `${String(
                  next.getHours(),
                ).padStart(2, '0')}:${String(
                  next.getMinutes(),
                ).padStart(2, '0')}`

              setTimeText(formattedTime)

              updateDateTime(
                dateText,
                formattedTime,
              )
            }}
          />
        </View>

        {errors.dateTime?.message ? (
          <Text style={styles.error}>
            {errors.dateTime.message}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.overline}>
          CONTEXTO
        </Text>

        <MeasurementOptionSelector
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

        <MeasurementOptionSelector
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
          error={
            errors.position?.message
          }
        />

        <View style={styles.notesField}>
          <Text style={styles.label}>
            Notas
          </Text>

          <TextInput
            value={watch('notes') ?? ''}
            onChangeText={value =>
              setValue(
                'notes',
                value,
                {
                  shouldDirty: true,
                },
              )
            }
            multiline
            numberOfLines={4}
            onFocus={onNotesFocus}
            placeholder="Agregar una nota..."
            placeholderTextColor={
              theme.colors.textSecondary
            }
            style={[
              styles.input,
              styles.notes,
            ]}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.saveButtonContainer}>
        <AppButton
          title={
            mode === 'edit'
              ? 'Guardar cambios'
              : 'Guardar medición'
          }
          onPress={submit}
          loading={isSubmitting}
        />

        {showSaveSuccess ? (
          <Animated.View
            style={[
              styles.saveSuccess,
              {
                opacity: saveSuccessPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    scale:
                      saveSuccessPulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 1],
                      }),
                  },
                ],
              },
            ]}
          >
            <View
              style={styles.saveSuccessGlow}
            />
            <Text style={styles.saveSuccessCheck}>
              ✓
            </Text>
          </Animated.View>
        ) : null}
      </View>

      {mode === 'edit' ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (!existingRecord) {
              return
            }

            measurementStore.delete(
              existingRecord.id,
            )

            onSaved?.()
          }}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>
            Eliminar medición
          </Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:
      theme.spacing.md,
    gap: theme.spacing.md,
  },

  saveButtonContainer: {
    position: 'relative',
  },

  saveSuccess: {
    position: 'absolute',
    top: '50%',
    right: theme.spacing.md,
    width: 30,
    height: 30,
    marginTop: -15,
    borderRadius: theme.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveSuccessGlow: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.success,
    opacity: 0.18,
  },

  saveSuccessCheck: {
    width: 22,
    height: 22,
    borderRadius: theme.radius.round,
    textAlign: 'center',
    lineHeight: 22,
    backgroundColor: theme.colors.success,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  header: {
    gap: theme.spacing.xs,
  },

  title: {
    fontFamily:
      theme.typography.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    lineHeight: 22,
    color:
      theme.colors.textSecondary,
  },

  metricsSection: {
    gap: theme.spacing.sm,
  },

  overline: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.overline,
    lineHeight: 15,
    letterSpacing: 0.5,
    color:
      theme.colors.textSecondary,
  },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },

  fcRow: {
    alignItems: 'center',
  },

  section: {
    gap: theme.spacing.sm,
  },

  dateTimeRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },

  dateField: {
    flex: 1.4,
    gap: theme.spacing.xs,
  },

  timeField: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  label: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.caption,
    color: theme.colors.text,
  },

  input: {
    minHeight: 52,
    backgroundColor:
      theme.colors.surface,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.sm,
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
  },

  notesField: {
    gap: theme.spacing.xs,
  },

  notes: {
    minHeight: 88,
    paddingTop: theme.spacing.sm,
  },

  error: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color: theme.colors.danger,
  },

  deleteButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteText: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    color: theme.colors.danger,
  },
})
