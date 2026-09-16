import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  style?: StyleProp<ViewStyle>
}

export function SectionHeader({
  title,
  subtitle,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },

  title: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.title,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
})
