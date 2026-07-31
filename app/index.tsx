import { useState } from 'react'

import { MeasurementForm } from '@/components/forms/MeasurementForm'
import { MeasurementHistory } from '@/components/forms/MeasurementHistory'
import { Screen } from '@/components/ui'

export default function HomeScreen() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <Screen>
      <MeasurementForm
        onSaved={() => setRefreshKey((value) => value + 1)}
      />

      <MeasurementHistory
        refreshKey={refreshKey}
      />
    </Screen>
  )
}
