import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'

import { initializeDatabase } from '@/core/database'

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase()
  }, [])

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  )
}
