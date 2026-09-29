import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'
import { SplashScreen } from 'expo-router'

import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans'

import { initializeDatabase } from '@/core/database'
import AppSplashScreen from '@/features/splash/screens/SplashScreen'
import { syncScheduledBackupTask } from '@/features/backup/services/ScheduledBackupService'

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
  const [showSplash, setShowSplash] =
    useState(true)

  const [fontsLoaded, fontError] =
    useFonts({
      DMSans_400Regular,
      DMSans_500Medium,
      DMSans_600SemiBold,
      DMSans_700Bold,
    })

  useEffect(() => {
    initializeDatabase()

    try {
      void syncScheduledBackupTask()
    } catch {
      // La sincronización del scheduler no debe impedir
      // que CardioSync pueda iniciar normalmente.
    }
  }, [])

  useEffect(() => {
    async function prepare() {
      if (
        !fontsLoaded &&
        !fontError
      ) {
        return
      }

      await SplashScreen.hideAsync()

      setTimeout(() => {
        setShowSplash(false)
      }, 3500)
    }

    void prepare()
  }, [fontsLoaded, fontError])

  if (
    !fontsLoaded &&
    !fontError
  ) {
    return null
  }

  if (showSplash) {
    return <AppSplashScreen />
  }

  return (
    <>
      <StatusBar style="dark" />

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
