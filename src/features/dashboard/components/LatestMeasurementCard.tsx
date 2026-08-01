import { StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'

type Props = {
  systolic: number | null
  diastolic: number | null
}

export function LatestMeasurementCard({
  systolic,
  diastolic,
}: Props) {
  const value =
    systolic == null || diastolic == null
      ? '-- / --'
      : `${systolic} / ${diastolic}`

  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>
          Última medición
        </Text>

        <Text style={styles.pressure}>
          {value}
        </Text>

        <Text style={styles.unit}>
          mmHg
        </Text>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },

  pressure: {
    fontSize: 42,
    fontWeight: '700',
  },

  unit: {
    fontSize: 15,
    opacity: 0.6,
  },
})
