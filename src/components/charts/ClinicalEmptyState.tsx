import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'

export function ClinicalEmptyState() {
  return (
    <View style={styles.container}>
      <Text variant="title">
        Sin datos
      </Text>

      <Text>
        No hay mediciones disponibles para mostrar.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
})
