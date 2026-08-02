import { StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'
import { classifyBloodPressure } from '@/features/measurements/utils/classifyBloodPressure'
import { theme } from '@/theme'

type Props = {
  systolic: number | null
  diastolic: number | null
}

export function LatestMeasurementCard({
  systolic,
  diastolic,
}: Props) {
  const hasMeasurement =
    systolic != null && diastolic != null

  const value = hasMeasurement
    ? `${systolic} / ${diastolic}`
    : '-- / --'

  const classification = hasMeasurement
    ? classifyBloodPressure(systolic, diastolic)
    : null

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Última medición
          </Text>
          <Text style={styles.unit}>mmHg</Text>
        </View>

        <Text style={styles.pressure}>{value}</Text>

        <View
          style={[
            styles.badge,
            classification && {
              borderColor: classification.color,
            },
          ]}
        >
          <Text style={styles.badgeLabel}>
            Clasificación:
          </Text>
          <Text
            style={[
              styles.badgeValue,
              classification && {
                color: classification.color,
              },
            ]}
          >
            {classification?.label ?? 'Sin mediciones'}
          </Text>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 4,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  pressure: {
    fontSize: 42,
    fontWeight: '700',
    color: theme.colors.text,
  },

  unit: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.background,
  },

  badgeLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  badgeValue: {
    fontSize: 12,
    fontWeight: '700',
  },
})
