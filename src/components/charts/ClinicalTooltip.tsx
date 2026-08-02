import { StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'

type Props = {
  visible: boolean

  date: string

  systolic: number

  diastolic: number
}

export function ClinicalTooltip({
  visible,
  date,
  systolic,
  diastolic,
}: Props) {
  if (!visible) {
    return null
  }

  return (
    <Card>
      <View style={styles.container}>
        <Text>
          {date}
        </Text>

        <Text>
          Sistólica: {systolic} mmHg
        </Text>

        <Text>
          Diastólica: {diastolic} mmHg
        </Text>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
})
