import { StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'

type Row = {
  label: string
  value?: number
  unit: string
  color: string
  symbol?: string
}

type Props = {
  visible: boolean
  date: string
  values: Row[]
}

export function ClinicalTooltip({
  visible,
  date,
  values,
}: Props) {
  if (!visible) return null

  return (
    <Card>
      <View style={styles.container}>

        <Text variant="title">
          {date}
        </Text>

        {values
          .filter(v => v.value !== undefined)
          .map(v => (
            <View
              key={v.label}
              style={styles.row}
            >
              <Text
                style={{
                  color: v.color,
                  width: 24,
                }}
              >
                {v.symbol ?? '•'}
              </Text>

              <Text
                style={styles.label}
              >
                {v.label}
              </Text>

              <Text
                style={{
                  color: v.color,
                  fontWeight: '700',
                }}
              >
                {v.value} {v.unit}
              </Text>
            </View>
          ))}

      </View>
    </Card>
  )
}

const styles = StyleSheet.create({

  container:{
    gap:6,
    minWidth:220,
  },

  row:{
    flexDirection:'row',
    alignItems:'center',
  },

  label:{
    flex:1,
  },

})
