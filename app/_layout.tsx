import { Stack } from 'expo-router'
import { useEffect } from 'react'

import { initializeDatabase } from '@/core/database'

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase()
  }, [])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}
