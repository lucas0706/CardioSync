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

export function StatisticsDateRangeSelector({
  startDate,
  endDate,
  onChange,
}: Props) {
  function handleStartChange(
    date: Date,
  ) {
    if (
      endDate &&
      date.getTime() > endDate.getTime()
    ) {
      onChange(endDate, date)
      return
    }

    onChange(date, endDate)
  }

  function handleEndChange(
    date: Date,
  ) {
    if (!startDate) {
      onChange(date)
      return
    }

    if (
      date.getTime() < startDate.getTime()
    ) {
      onChange(date, startDate)
      return
    }

    onChange(startDate, date)
  }

  const defaultStart =
    startDate ??
    new Date()

  const defaultEnd =
    endDate ??
    startDate ??
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
