import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
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

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden.
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
  }, [])

  useEffect(() => {
    async function checkUpdates() {
      try {
        const update =
          await Updates.checkForUpdateAsync()

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync()

          await Updates.reloadAsync()
        }
      } catch (error) {
        console.log(
          '[OTA] update check failed',
          error,
        )
      }
    }

    void checkUpdates()
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
