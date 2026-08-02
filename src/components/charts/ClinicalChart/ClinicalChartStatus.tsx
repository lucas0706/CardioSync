import { View, StyleSheet } from 'react-native'

import { Text } from '@/components/ui'

type Props = {
  points: number
  variables: number
}

export function ClinicalChartStatus({
  points,
  variables,
}: Props) {

  return (
    <View style={styles.container}>

      <Text>
        Mediciones: {points}
      </Text>

      <Text>
        Variables: {variables}
      </Text>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    gap:12,
  },
})
