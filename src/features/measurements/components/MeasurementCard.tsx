import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { ClassificationBadge } from '@/features/measurements/components/ClassificationBadge'
import { classifyBloodPressure } from '@/features/measurements/utils/classifyBloodPressure'
import { formatDateTime } from '@/utils/date'

type Props = {
  record: BloodPressureRecord
}

export function MeasurementCard({
  record,
}: Props) {
  const router = useRouter()
  const classification = classifyBloodPressure(
    record.systolic,
    record.diastolic,
  )

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/measurement/[id]',
          params: { id: record.id },
        })
      }
    >
      <Card>
        <View style={styles.header}>
        <ClassificationBadge
          classification={classification}
        />

        <Text style={styles.date}>
          {formatDateTime(record.dateTime)}
        </Text>
      </View>

      <Text style={styles.pressure}>
        {record.systolic}/{record.diastolic}
      </Text>

      <View style={styles.info}>
        {record.heartRate != null && (
          <Text>
            ❤️ {record.heartRate} lpm
          </Text>
        )}

        {record.weight != null && (
          <Text>
            ⚖️ {record.weight} kg
          </Text>
        )}
      </View>

        {record.notes ? (
          <Text style={styles.notes}>
            {record.notes}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  date: {
    opacity: 0.6,
  },

  pressure: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 12,
  },

  info: {
    gap: 6,
  },

  notes: {
    marginTop: 12,
    opacity: 0.75,
  },
})
