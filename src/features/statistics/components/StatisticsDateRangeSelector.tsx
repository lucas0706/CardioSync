import { StyleSheet, View } from 'react-native'
import { Calendar } from 'react-native-calendars'

import { Card, Text } from '@/components/ui'

interface Props {
  startDate?: Date
  endDate?: Date
  onChange: (
    startDate: Date,
    endDate: Date,
  ) => void
}

function formatCalendarDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export function StatisticsDateRangeSelector({
  startDate,
  endDate,
  onChange,
}: Props) {
  const markedDates = {
    ...(startDate && {
      [formatCalendarDate(startDate)]: {
        startingDay: true,
        color: '#2563EB',
      },
    }),

    ...(endDate && {
      [formatCalendarDate(endDate)]: {
        endingDay: true,
        color: '#2563EB',
      },
    }),
  }

  return (
    <Card style={styles.card}>
      <Text variant="caption">
        Seleccionar periodo
      </Text>

      <Calendar
        markingType="period"
        markedDates={markedDates}
        onDayPress={(day) => {
          const selected = new Date(day.dateString)

          if (!startDate || endDate) {
            onChange(selected, selected)
            return
          }

          if (selected < startDate) {
            onChange(selected, startDate)
            return
          }

          onChange(startDate, selected)
        }}
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
})
