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
        <View style={styles.content}>
          <View style={styles.leftColumn}>
            <Text style={styles.pressure}>
              {record.systolic}/{record.diastolic} mmHg
            </Text>

            <Text style={styles.secondaryLine}>
              {[
                record.heartRate != null ? `❤️ ${record.heartRate} bpm` : null,
                formatDateTime(record.dateTime),
                record.arm === 'left'
                  ? 'Brazo izquierdo'
                  : record.arm === 'right'
                    ? 'Brazo derecho'
                    : null,
                record.position === 'sitting'
                  ? 'Sentado'
                  : record.position === 'standing'
                    ? 'De pie'
                    : record.position === 'lying'
                      ? 'Acostado'
                      : null,
              ]
                .filter(Boolean)
                .join(' • ')}
            </Text>
          </View>

          <View style={styles.rightColumn}>
            <ClassificationBadge classification={classification} />
          </View>
        </View>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  leftColumn: {
    flex: 1,
    gap: 1,
  },

  pressure: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },

  secondaryLine: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 14,
  },

  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
})
