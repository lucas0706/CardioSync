import { View, StyleSheet } from 'react-native'

import { Card, Text } from '@/components/ui'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

type Props = {
  data: BloodPressureRecord[]
}

export function BloodPressureChart({ data }: Props) {
  return (
    <Card>
      <View style={styles.container}>
        <Text variant="title">
          Evolución
        </Text>

        <Text variant="body">
          El nuevo gráfico clínico con Victory Native se implementará sobre este componente.
        </Text>

        <Text variant="caption">
          Registros disponibles: {data.length}
        </Text>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
})
