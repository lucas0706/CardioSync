import { PropsWithChildren } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { theme } from '@/theme'

interface ScreenProps
  extends PropsWithChildren {
  style?: ViewStyle
}

export function Screen({
  children,
  style,
}: ScreenProps) {
  return (
    <SafeAreaView
      style={[
        styles.container,
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      theme.colors.background,
    paddingHorizontal:
      theme.spacing.md,
    paddingTop:
      theme.spacing.lg,
    paddingBottom:
      theme.spacing.md,
  },
})
