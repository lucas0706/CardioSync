import { useState } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import DateTimePicker from '@expo/ui/community/datetime-picker'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type Mode = 'date' | 'time'

type Props = {
  label: string
  value: Date
  mode: Mode
  onChange: (date: Date) => void
}

export function MeasurementDateTimeField({
  label,
  value,
  mode,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)

  const displayValue =
    mode === 'date'
      ? value.toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : value.toLocaleTimeString('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Seleccionar ${label.toLowerCase()}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.value}>
          {displayValue}
        </Text>

        <Text style={styles.chevron}>
          ›
        </Text>
      </Pressable>

      {open ? (
        <DateTimePicker
          value={value}
          mode={mode}
          presentation="dialog"
          display="default"
          is24Hour
          accentColor={theme.colors.primary}
          positiveButton={{
            label: 'Aceptar',
          }}
          negativeButton={{
            label: 'Cancelar',
          }}
          onValueChange={(_, date) => {
            onChange(date)
            setOpen(false)
          }}
          onDismiss={() => {
            setOpen(false)
          }}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  label: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.caption,
    color: theme.colors.text,
  },

  field: {
    minHeight: 52,
    paddingHorizontal:
      theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pressed: {
    opacity: 0.7,
  },

  value: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    color: theme.colors.text,
  },

  chevron: {
    fontFamily:
      theme.typography.regular,
    fontSize: 28,
    lineHeight: 28,
    color:
      theme.colors.textSecondary,
  },
})
