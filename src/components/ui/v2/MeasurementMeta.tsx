import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type MeasurementMetaProps = {
  heartRate?: number | null
  time?: string | null
  arm?: string | null
  position?: string | null
  style?: StyleProp<ViewStyle>
}

export function MeasurementMeta({
  heartRate,
  time,
  arm,
  position,
  style,
}: MeasurementMetaProps) {
  const items = [
    heartRate != null ? `FC ${heartRate}` : null,
    time,
    arm,
    position,
  ].filter(
    (item): item is string =>
      Boolean(item),
  )

  if (items.length === 0) {
    return null
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>
        {items.join(' · ')}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.xs,
  },

  text: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },
})
