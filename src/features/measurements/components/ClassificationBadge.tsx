import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'

import type { BloodPressureClassification } from '@/domain/clinical/classification'

type Props = {
  classification: BloodPressureClassification
}

export function ClassificationBadge({
  classification,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: classification.color,
        },
      ]}
    >
      <Text style={styles.text}>
        {classification.label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
})
