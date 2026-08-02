import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'
import { MeasurementCard } from '@/features/measurements/components/MeasurementCard'
import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

type Props = {
  refreshKey?: number
}

export function MeasurementHistory({ refreshKey }: Props) {
  const {
    loading,
    measurements,
    refresh,
  } = useMeasurements()

  useEffect(() => {
    refresh()
  }, [refresh, refreshKey])

  if (loading) {
    return <Text>Cargando...</Text>
  }

  if (measurements.length === 0) {
    return <Text>No hay mediciones registradas.</Text>
  }

  return (
    <View style={styles.container}>
      {measurements.map((record) => (
        <MeasurementCard
          key={record.id}
          record={record}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 20,
  },
})
