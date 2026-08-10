import {
  StyleSheet,
  View,
} from 'react-native'

import {
  Calendar,
  type DateData,
  type MarkedDates,
} from 'react-native-calendars'

import { Text } from '@/components/ui'

interface Props {
  startDate?: Date
  endDate?: Date
  onChange: (
    startDate: Date,
    endDate?: Date,
  ) => void
}

function formatDate(date?: Date): string {
  if (!date) {
    return '--'
  }

  return date.toLocaleDateString(
    'es-AR',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
}

function toDate(dateString: string): Date {
  return new Date(
    `${dateString}T00:00:00`,
  )
}

function toDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function startOfDay(date: Date): Date {
  const result = new Date(date)

  result.setHours(
    0,
    0,
    0,
    0,
  )

  return result
}

function buildMarkedDates(
  startDate?: Date,
  endDate?: Date,
): MarkedDates {
  if (!startDate) {
    return {}
  }

  const start = startOfDay(startDate)

  if (!endDate) {
    return {
      [toDateString(start)]: {
        startingDay: true,
        endingDay: true,
        selected: true,
      },
    }
  }

  const end = startOfDay(endDate)

  const first =
    start.getTime() <= end.getTime()
      ? start
      : end

  const last =
    start.getTime() <= end.getTime()
      ? end
      : start

  const marked: MarkedDates = {}

  const current = new Date(first)

  while (
    current.getTime() <=
    last.getTime()
  ) {
    const key = toDateString(current)

    const isFirst =
      current.getTime() ===
      first.getTime()

    const isLast =
      current.getTime() ===
      last.getTime()

    marked[key] = {
      startingDay: isFirst,
      endingDay: isLast,
      selected: true,
    }

    current.setDate(
      current.getDate() + 1,
    )
  }

  return marked
}

export function StatisticsDateRangeSelector({
  startDate,
  endDate,
  onChange,
}: Props) {
  function handleDayPress(
    day: DateData,
  ) {
    const selectedDate =
      toDate(day.dateString)

    if (
      !startDate ||
      (startDate && endDate)
    ) {
      onChange(selectedDate)

      return
    }

    const currentStart =
      startOfDay(startDate)

    const currentSelected =
      startOfDay(selectedDate)

    if (
      currentSelected.getTime() <
      currentStart.getTime()
    ) {
      onChange(
        selectedDate,
        startDate,
      )

      return
    }

    onChange(
      startDate,
      selectedDate,
    )
  }

  const markedDates =
    buildMarkedDates(
      startDate,
      endDate,
    )

  return (
    <View style={styles.container}>
      <Text
        variant="caption"
        style={styles.instruction}
      >
        Seleccioná primero la fecha de inicio
        y después la fecha de finalización.
      </Text>

      <View style={styles.range}>
        <View style={styles.dateBlock}>
          <Text variant="caption">
            Desde
          </Text>

          <Text style={styles.date}>
            {formatDate(startDate)}
          </Text>
        </View>

        <View style={styles.separator}>
          <Text variant="caption">
            →
          </Text>
        </View>

        <View style={styles.dateBlock}>
          <Text variant="caption">
            Hasta
          </Text>

          <Text style={styles.date}>
            {formatDate(endDate)}
          </Text>
        </View>
      </View>

      <Calendar
        markingType="period"
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      {startDate && !endDate ? (
        <Text
          variant="caption"
          style={styles.pending}
        >
          Ahora seleccioná la fecha de
          finalización.
        </Text>
      ) : null}

      {startDate && endDate ? (
        <Text
          variant="caption"
          style={styles.pending}
        >
          Rango seleccionado.
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  instruction: {
    marginBottom: 12,
  },

  range: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  dateBlock: {
    flex: 1,
    gap: 4,
  },

  separator: {
    paddingHorizontal: 12,
  },

  date: {
    fontSize: 16,
    fontWeight: '600',
  },

  pending: {
    marginTop: 8,
  },
})
