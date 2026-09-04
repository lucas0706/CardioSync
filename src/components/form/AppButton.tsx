import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type Props = {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
}

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: Props) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color="#FFFFFF"
          size="small"
        />
      ) : (
        <Text style={styles.text}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
