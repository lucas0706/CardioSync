import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { theme } from '@/theme'
import { Text } from './Text'

type ScreenHeaderProps = {
  title: string
  subtitle?: string
  eyebrow?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
}

export function ScreenHeader({ title, subtitle, eyebrow, leading, trailing }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <View style={styles.actionSlot}>{leading}</View>

        <View style={[styles.actionSlot, styles.trailingSlot]}>{trailing}</View>
      </View>

      <View style={styles.titleBlock}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}

        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>

        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },

  actionRow: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  actionSlot: {
    minWidth: 36,
    minHeight: 32,
    justifyContent: 'center',
  },

  trailingSlot: {
    alignItems: 'flex-end',
  },

  titleBlock: {
    gap: theme.spacing.xs,
  },

  eyebrow: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
  },

  title: {
    fontFamily: theme.typography.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.body,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
})
