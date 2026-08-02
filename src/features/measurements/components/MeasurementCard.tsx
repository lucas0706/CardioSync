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
          <ClassificationBadge classification={classification} />

          <Text style={styles.date}>
            {formatDateTime(record.dateTime)}
          </Text>
        </View>

        <Text style={styles.pressure}>
          {record.systolic}/{record.diastolic}
        </Text>

        <View style={styles.info}>
          {record.heartRate != null && (
            <Text style={styles.metaText}>
              ❤️ {record.heartRate} lpm
            </Text>
          )}

          {(record.arm || record.position) && (
            <Text style={styles.metaText}>
              {record.arm === 'left' ? 'Izq.' : record.arm === 'right' ? 'Der.' : ''}
              {record.arm && record.position ? ' · ' : ''}
              {record.position === 'sitting'
                ? 'Sentado'
                : record.position === 'standing'
                  ? 'De pie'
                  : record.position === 'lying'
                    ? 'Acostado'
                    : ''}
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
    marginBottom: 8,
  },

  date: {
    color: '#64748B',
    fontSize: 12,
    opacity: 0.9,
  },

  pressure: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 6,
  },

  info: {
    gap: 2,
  },

  metaText: {
    color: '#475569',
    fontSize: 12,
  },

  notes: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 8,
    opacity: 0.9,
  },
})
