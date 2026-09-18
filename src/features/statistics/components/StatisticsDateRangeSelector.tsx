import {
  StyleSheet,
  View,
} from 'react-native'

import {
  MeasurementDateTimeField,
} from '@/features/measurements/components/v2/MeasurementDateTimeField'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

interface Props {
  startDate?: Date
  endDate?: Date
  onChange: (
    startDate: Date,
    endDate?: Date,
  ) => void
}

function normalizeDate(
  date: Date,
): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    12,
    0,
    0,
    0,
  )
}

export function StatisticsDateRangeSelector({
  startDate,
  endDate,
  onChange,
}: Props) {
  function handleStartChange(
    date: Date,
  ) {
    const normalizedDate =
      normalizeDate(date)

    if (
      endDate &&
      normalizedDate.getTime() >
        endDate.getTime()
    ) {
      onChange(
        endDate,
        normalizedDate,
      )
      return
    }

    onChange(
      normalizedDate,
      endDate,
    )
  }

  function handleEndChange(
    date: Date,
  ) {
    const normalizedDate =
      normalizeDate(date)

    if (!startDate) {
      onChange(normalizedDate)
      return
    }

    if (
      normalizedDate.getTime() <
      startDate.getTime()
    ) {
      onChange(
        normalizedDate,
        startDate,
      )
      return
    }

    onChange(
      startDate,
      normalizedDate,
    )
  }

  const defaultStart =
    startDate ??
    new Date()

  const defaultEnd =
    endDate ??
    new Date()

  return (
    <View style={styles.container}>
      <Text
        variant="caption"
        style={styles.instruction}
      >
        Seleccioná el período que querés analizar.
      </Text>

      <View style={styles.fields}>
        <MeasurementDateTimeField
          label="Desde"
          value={defaultStart}
          mode="date"
          onChange={handleStartChange}
        />

        <MeasurementDateTimeField
          label="Hasta"
          value={defaultEnd}
          mode="date"
          onChange={handleEndChange}
        />
      </View>

      {startDate && endDate ? (
        <Text
          variant="caption"
          style={styles.status}
        >
          Rango seleccionado.
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom:
      theme.spacing.md,
    gap: theme.spacing.sm,
  },

  instruction: {
    color:
      theme.colors.textSecondary,
  },

  fields: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  status: {
    color:
      theme.colors.textSecondary,
  },
})
