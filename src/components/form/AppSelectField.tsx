import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from 'react-hook-form'

import { Text } from '@/components/ui'

type Option<T> = {
  label: string
  value: T
}

type Props<
  T extends FieldValues,
  V,
> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  options: Option<V>[]
  error?: string
}

export function AppSelectField<
  T extends FieldValues,
  V,
>({
  control,
  name,
  label,
  options,
  error,
}: Props<T, V>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <View style={styles.container}>
          <Text style={styles.label}>
            {label}
          </Text>

          <View style={styles.options}>
            {options.map((option) => (
              <Pressable
                key={String(option.value)}
                onPress={() =>
                  field.onChange(option.value)
                }
                style={[
                  styles.option,
                  field.value === option.value &&
                    styles.selected,
                ]}
              >
                <Text>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
  },

  options: {
    flexDirection: 'row',
    gap: 8,
  },

  option: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },

  selected: {
    borderColor: '#2563EB',
  },

  error: {
    color: '#DC2626',
    fontSize: 12,
  },
})
