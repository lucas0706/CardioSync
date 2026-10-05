import { Pressable, StyleSheet } from 'react-native'

import { theme } from '@/theme'

import { Text } from './Text'

type Props = {
  title: string
  onPress?: () => void
  disabled?: boolean
}

export function Button({ title, onPress, disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  text: {
    fontFamily: theme.typography.semiBold,
    color: theme.colors.white,
  },
})
