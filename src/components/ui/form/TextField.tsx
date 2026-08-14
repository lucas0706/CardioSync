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
  multiline?: boolean
  value?: string
  onChange(value: string): void
}

export function TextField({
  label,
  placeholder,
  multiline = false,
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
        ]}
        placeholder={placeholder}
        placeholderTextColor={
          theme.colors.textSecondary
        }
        multiline={multiline}
        textAlignVertical="top"
        value={value}
        onChangeText={onChange}
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

  multiline: {
    minHeight: 120,
  },
})
