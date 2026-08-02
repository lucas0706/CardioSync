import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Screen } from '@/components/ui'
import { MeasurementForm } from '@/features/measurements/components/MeasurementForm'

export default function NewMeasurementScreen() {
  const router = useRouter()

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <MeasurementForm onSaved={() => router.back()} />
        </ScrollView>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
})
