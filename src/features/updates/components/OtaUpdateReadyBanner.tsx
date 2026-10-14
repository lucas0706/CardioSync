import { StyleSheet, View } from 'react-native'

import { Button, Text } from '@/components/ui'
import { theme } from '@/theme'

type OtaUpdateReadyBannerProps = {
  onApply: () => void
  onDismiss: () => void
}

export function OtaUpdateReadyBanner({ onApply, onDismiss }: OtaUpdateReadyBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualización OTA lista</Text>
      <Text style={styles.subtitle}>
        Se descargó una actualización. Elegí cuándo reiniciar para aplicarla. Si la posponés, Expo
        podría aplicarla al próximo inicio en frío.
      </Text>
      <View style={styles.actions}>
        <Button title="Aplicar ahora" onPress={onApply} />
        <Button title="Más tarde" onPress={onDismiss} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10000,
    gap: 8,
    borderRadius: theme.radius.md,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.typography.bold,
    color: theme.colors.text,
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  actions: {
    gap: 8,
  },
})
