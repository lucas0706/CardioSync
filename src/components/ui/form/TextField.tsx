import { StyleSheet, TextInput, View } from 'react-native'

import { Text } from '@/components/ui'

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
    gap: 6,
  },

  label: {
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#D4D4D8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },

  multiline: {
    minHeight: 120,
  },
})
