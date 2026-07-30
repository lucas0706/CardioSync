import { PropsWithChildren } from 'react'
import { View, StyleSheet } from 'react-native'

import { theme } from '@/theme'

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
})
