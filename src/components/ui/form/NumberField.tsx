import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type Props = {
  label: string
  placeholder?: string
  value?: number
  keyboardType?:
    | 'number-pad'
    | 'decimal-pad'
  onChange(value?: number): void
}

export function NumberField({
  label,
  placeholder,
  value,
  keyboardType = 'number-pad',
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={
          theme.colors.textSecondary
        }
        keyboardType={keyboardType}
        value={value?.toString() ?? ''}
        onChangeText={text => {
          if (!text) {
            onChange(undefined)
            return
          }

          const parsed = Number(text)

          if (!Number.isNaN(parsed)) {
            onChange(parsed)
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },

  label: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.caption,
    color: theme.colors.text,
  },

  input: {
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.md,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.sm,
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    color: theme.colors.text,
    backgroundColor:
      theme.colors.surface,
  },
})
