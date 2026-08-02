import { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { theme } from '@/theme'

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
  padded?: boolean
  outlined?: boolean
}>

export function Card({
  children,
  style,
  padded = true,
  outlined = false,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        outlined && styles.outlined,
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  padded: {
    padding: 16,
  },

  outlined: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
})
