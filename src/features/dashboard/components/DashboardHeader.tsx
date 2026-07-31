import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'

export function DashboardHeader() {
  const hour = new Date().getHours()

  const greeting =
    hour < 12
      ? 'Buenos días'
      : hour < 19
      ? 'Buenas tardes'
      : 'Buenas noches'

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {greeting}
      </Text>

      <Text style={styles.subtitle}>
        CardioSync
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
})
