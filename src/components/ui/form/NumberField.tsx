import { StyleSheet, TextInput, View } from 'react-native'

import { Text } from '@/components/ui'

type Props = {
  label: string
  placeholder?: string
  value?: number
  keyboardType?: 'number-pad' | 'decimal-pad'
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
        keyboardType={keyboardType}
        value={value?.toString() ?? ''}
        onChangeText={(text) => {
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
})
