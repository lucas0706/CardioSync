import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native'

import { FloatingActionButton, Screen } from '@/components/ui'
import { MeasurementHistory } from '@/features/measurements/components/MeasurementHistory'

export default function MeasurementsScreen() {
  const router = useRouter()

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MeasurementHistory />
      </ScrollView>

      <FloatingActionButton onPress={() => router.push('/measurement/new')} />
    </Screen>
  )
}
