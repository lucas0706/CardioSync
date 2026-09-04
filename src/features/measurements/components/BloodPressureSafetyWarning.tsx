import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'

import type {
  BloodPressureSafetyWarning as SafetyWarning,
} from '@/domain/clinical/classification'

type Props = {
  warnings?: SafetyWarning[]
}

const WARNING_MESSAGES: Record<
  SafetyWarning,
  string
> = {
  'low-diastolic':
    'Presión arterial diastólica baja.',
}

export function BloodPressureSafetyWarning({
  warnings = [],
}: Props) {
  if (warnings.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Precaución clínica
      </Text>

      {warnings.map((warning) => (
        <Text
          key={warning}
          style={styles.message}
        >
          {WARNING_MESSAGES[warning]}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: 3,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },

  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },

  message: {
    fontSize: 12,
    lineHeight: 16,
    color: '#9A3412',
  },
})
