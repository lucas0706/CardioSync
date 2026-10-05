import * as Notifications from 'expo-notifications'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans'

import { initializeDatabase } from '@/core/database'
import {
  runPendingBackupCheck,
  syncScheduledBackupAlarms,
} from '@/features/backup/services/ScheduledBackupService'
import AppSplashScreen from '@/features/splash/screens/SplashScreen'
import { UpdateBanner } from '@/features/updates/components/UpdateBanner'
import { otaUpdateService } from '@/features/updates/services/OtaUpdateService'

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden.
})

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true)

  const [showUpdateBanner, setShowUpdateBanner] = useState(false)

  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  })

  useEffect(() => {
    initializeDatabase()

    void syncScheduledBackupAlarms().catch((error) => {
      console.error('Could not synchronize scheduled backup alarms.', error)
    })
    void runPendingBackupCheck()
  }, [])

  useEffect(() => {
    void otaUpdateService.shouldShowUpdateBanner().then((show) => {
      if (!show) {
        return
      }

      setShowUpdateBanner(true)

      setTimeout(() => {
        setShowUpdateBanner(false)
      }, 5000)
    })
  }, [])

  useEffect(() => {
    async function prepare() {
      if (!fontsLoaded && !fontError) {
        return
      }

      await SplashScreen.hideAsync()

      setTimeout(() => {
        setShowSplash(false)
      }, 3500)
    }

    void prepare()
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  if (showSplash) {
    return <AppSplashScreen />
  }

  return (
    <>
      <StatusBar style="dark" />

      {showUpdateBanner && <UpdateBanner />}

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sqlite-backup-poc" />
      </Stack>
    </>
  )
}
