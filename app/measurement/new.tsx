import { useRef } from 'react'
import { useRouter } from 'expo-router'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { Screen } from '@/components/ui'
import { MeasurementForm } from '@/features/measurements/components/MeasurementForm'

export default function NewMeasurementScreen() {
  const router = useRouter()

  const scrollRef =
    useRef<ScrollView>(null)

  const handleNotesFocus = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      })
    }, 250)
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View
            style={styles.formWrapper}
          >
            <MeasurementForm
              onNotesFocus={
                handleNotesFocus
              }
              onSaved={() =>
                router.back()
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },

  formWrapper: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
})
