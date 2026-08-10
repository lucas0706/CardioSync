import {
  Alert,
  StyleSheet,
  View,
} from 'react-native'
import {
  useState,
} from 'react'

import {
  Button,
  Card,
  Screen,
  Text,
} from '@/components/ui'

import {
  countReportTestData,
  removeReportTestData,
  seedReportTestData,
} from '@/devtools/reports/ReportTestData'

export default function ReportTestScreen() {
  const [
    count,
    setCount,
  ] = useState(
    countReportTestData(),
  )

  const seed = () => {
    const inserted =
      seedReportTestData()

    setCount(
      countReportTestData(),
    )

    Alert.alert(
      'Datos creados',
      `Se agregaron ${inserted} registros de prueba.`,
    )
  }

  const remove = () => {
    removeReportTestData()

    setCount(
      countReportTestData(),
    )

    Alert.alert(
      'Datos eliminados',
      'Se eliminaron únicamente los registros de prueba.',
    )
  }

  return (
    <Screen>
      <View style={styles.content}>
        <Text variant="h1">
          Datos de prueba
        </Text>

        <Card>
          <Text variant="title">
            Reporte 30 días
          </Text>

          <Text>
            Registros de prueba actuales:
            {' '}
            {count}
          </Text>

          <Text>
            Se crearán 60 registros:
            2 por día durante 30 días.
          </Text>
        </Card>

        <Button
          title="Crear 60 registros"
          onPress={seed}
        />

        <Button
          title="Eliminar registros de prueba"
          onPress={remove}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
})
