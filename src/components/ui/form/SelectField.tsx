import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'

export interface SelectOption<T extends string> {
  label: string
  value: T
}

type Props<T extends string> = {
  label: string
  value?: T
  options: readonly SelectOption<T>[]
  onChange(value: T): void
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value

          return (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                selected && styles.selected,
              ]}
              onPress={() => onChange(option.value)}
            >
              <Text
                style={
                  selected
                    ? styles.selectedText
                    : undefined
                }
              >
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  label: {
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  option: {
    borderWidth: 1,
    borderColor: '#D4D4D8',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  selected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  selectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
})
