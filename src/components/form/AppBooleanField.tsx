import {
  StyleSheet,
  Pressable,
  View,
} from 'react-native'

import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from 'react-hook-form'

import { Text } from '@/components/ui'

type Props<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  error?: string
}

export function AppBooleanField<
  T extends FieldValues,
>({
  control,
  name,
  label,
  error,
}: Props<T>) {
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
            <Pressable
              onPress={() =>
                field.onChange(true)
              }
              style={[
                styles.option,
                field.value === true &&
                  styles.selected,
              ]}
            >
              <Text>
                Sí
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                field.onChange(false)
              }
              style={[
                styles.option,
                field.value === false &&
                  styles.selected,
              ]}
            >
              <Text>
                No
              </Text>
            </Pressable>
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
