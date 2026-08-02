import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Screen } from '@/components/ui'
import { MeasurementForm } from '@/features/measurements/components/MeasurementForm'

export default function NewMeasurementScreen() {
  const router = useRouter()

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formWrapper}>
            <MeasurementForm onSaved={() => router.back()} />
          </View>
        </ScrollView>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },

  formWrapper: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
})
