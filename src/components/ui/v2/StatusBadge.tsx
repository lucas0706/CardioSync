import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type StatusBadgeProps = {
  label: string
  color?: string
  style?: StyleProp<ViewStyle>
}

export function StatusBadge({
  label,
  color = theme.colors.primary,
  style,
}: StatusBadgeProps) {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: color,
          },
        ]}
      />

      <Text
        style={[
          styles.label,
          {
            color,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.background,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: theme.radius.round,
  },

  label: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
  },
})
