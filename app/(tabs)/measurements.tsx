import { useRouter } from 'expo-router'

import {
  FloatingActionButton,
  Screen,
} from '@/components/ui'
import { MeasurementHistory } from '@/features/measurements/components/MeasurementHistory'

export default function MeasurementsScreen() {
  const router = useRouter()

  return (
    <Screen>
      <MeasurementHistory />

      <FloatingActionButton
        onPress={() =>
          router.push('/measurement/new')
        }
      />
    </Screen>
  )
}
