import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

export function DashboardHeader() {
  const hour = new Date().getHours()

  const greeting =
    hour < 12
      ? 'Buenos días'
      : hour < 19
      ? 'Buenas tardes'
      : 'Buenas noches'

  const subtitle =
    hour < 12
      ? 'Así está tu presión hoy'
      : 'Resumen de tus últimas mediciones'

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Monitoreo diario</Text>
      </View>

      <Text variant="h1" style={styles.title}>
        {greeting}
      </Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 4,
    gap: 6,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  badgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
})
