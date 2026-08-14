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
import { theme } from '@/theme'

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

export function MeasurementOptionSelector<
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
            {options.map(option => {
              const selected =
                field.value === option.value

              return (
                <Pressable
                  key={String(option.value)}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected,
                  }}
                  accessibilityLabel={option.label}
                  onPress={() =>
                    field.onChange(
                      option.value,
                    )
                  }
                  style={({ pressed }) => [
                    styles.option,
                    selected &&
                      styles.selected,
                    pressed &&
                      styles.pressed,
                  ]}
                >
                  <View
                    style={[
                      styles.indicator,
                      selected &&
                        styles.selectedIndicator,
                    ]}
                  >
                    {selected ? (
                      <Text
                        style={
                          styles.check
                        }
                      >
                        ✓
                      </Text>
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.optionText,
                      selected &&
                        styles.selectedText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              )
            })}
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
    gap: theme.spacing.xs,
  },

  label: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.caption,
    color: theme.colors.text,
  },

  options: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  option: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal:
      theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },

  selected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },

  pressed: {
    opacity: 0.7,
  },

  indicator: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedIndicator: {
    borderColor: theme.colors.primary,
    backgroundColor:
      theme.colors.primary,
  },

  check: {
    fontFamily:
      theme.typography.bold,
    fontSize: 12,
    lineHeight: 14,
    color: theme.colors.white,
  },

  optionText: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.caption,
    color:
      theme.colors.textSecondary,
  },

  selectedText: {
    fontFamily:
      theme.typography.semiBold,
    color: theme.colors.primary,
  },

  error: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color: theme.colors.danger,
  },
})
