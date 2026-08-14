import {
  Pressable,
  StyleSheet,
} from 'react-native'

import { theme } from '@/theme'

import { Text } from './Text'

type Props = {
  title: string
  onPress?: () => void
}

export function Button({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor:
      theme.colors.primary,
    paddingVertical:
      theme.spacing.md,
    borderRadius:
      theme.radius.md,
    alignItems: 'center',
  },

  text: {
    fontFamily:
      theme.typography.semiBold,
    color: theme.colors.white,
  },
})
