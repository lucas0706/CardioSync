import React, { forwardRef } from 'react'
import {
  StyleSheet,
  TextInput,
  TextInputProps,
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
} & TextInputProps

function Component<T extends FieldValues>(
  {
    control,
    name,
    label,
    error,
    style,
    ...props
  }: Props<T>,
  ref: React.ForwardedRef<TextInput>,
) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const isNumericInput =
          props.keyboardType === 'number-pad' ||
          props.keyboardType === 'decimal-pad' ||
          props.keyboardType === 'numeric'

        const handleChangeText = (text: string) => {
          if (!isNumericInput) {
            field.onChange(text)
            return
          }

          if (text === '') {
            field.onChange(undefined)
            return
          }

          const parsedValue =
            props.keyboardType === 'decimal-pad'
              ? Number.parseFloat(text)
              : Number.parseInt(text, 10)

          field.onChange(
            Number.isNaN(parsedValue)
              ? undefined
              : parsedValue,
          )
        }

        return (
          <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
              ref={ref}
              style={[
                styles.input,
                error && styles.inputError,
                style,
              ]}
              value={
                field.value == null
                  ? ''
                  : String(field.value)
              }
              onChangeText={handleChangeText}
              onBlur={field.onBlur}
              placeholderTextColor="#94A3B8"
              selectionColor="#2563EB"
              selectTextOnFocus
              {...props}
            />

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}
          </View>
        )
      }}
    />
  )
}

export const AppTextField =
  forwardRef(Component) as <
    T extends FieldValues,
  >(
    props: Props<T> & {
      ref?: React.Ref<TextInput>
    },
  ) => React.ReactElement

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#FFFFFF',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
  },

  inputError: {
    borderColor: '#DC2626',
  },

  error: {
    color: '#DC2626',
    fontSize: 12,
  },
})
