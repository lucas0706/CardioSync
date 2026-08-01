import { Screen } from '@/components/ui'
import { MeasurementForm } from '@/features/measurements/components/MeasurementForm'
import { MeasurementHistory } from '@/features/measurements/components/MeasurementHistory'
import { ScrollView } from 'react-native'
import { useState } from 'react'

export default function MeasurementsScreen() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MeasurementForm
          onSaved={() => setRefreshKey((k) => k + 1)}
        />

        <MeasurementHistory
          refreshKey={refreshKey}
        />
      </ScrollView>
    </Screen>
  )
}
