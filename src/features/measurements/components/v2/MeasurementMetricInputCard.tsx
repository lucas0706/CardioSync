import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type Props = {
  label: string
  value: string
  unit: string
  onChangeText: (value: string) => void
  keyboardType?: KeyboardTypeOptions
  error?: string
  style?: StyleProp<ViewStyle>
}

export function MeasurementMetricInputCard({
  label,
  value,
  unit,
  onChangeText,
  keyboardType = 'number-pad',
  error,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        style,
        error && styles.cardError,
      ]}
    >
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.input}
        placeholder="--"
        placeholderTextColor={
          theme.colors.textSecondary
        }
        selectionColor={
          theme.colors.primary
        }
        maxLength={4}
      />

      <Text style={styles.unit}>
        {unit}
      </Text>

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 108,
    height: 108,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      theme.colors.border,
  },

  cardError: {
    borderColor:
      theme.colors.danger,
  },

  label: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.label,
    color:
      theme.colors.textSecondary,
  },

  input: {
    marginTop: theme.spacing.xs,
    padding: 0,
    height: 42,
    fontFamily:
      theme.typography.bold,
    fontSize:
      theme.typography.metric,
    lineHeight: 42,
    color:
      theme.colors.text,
  },

  unit: {
    marginTop:
      theme.spacing.xs,
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
  },

  error: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: -18,
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.danger,
  },
})
