import { useRouter } from 'expo-router'

import {
  FloatingActionButton,
} from '@/components/ui'

import {
  MeasurementsV2Screen,
} from '@/features/measurements/screens/v2/MeasurementsV2Screen'

export default function MeasurementsScreen() {
  const router = useRouter()

  return (
    <>
      <MeasurementsV2Screen />

      <FloatingActionButton
        bottomOffset={8}
        onPress={() =>
          router.push('/measurement/new')
        }
      />
    </>
  )
}
