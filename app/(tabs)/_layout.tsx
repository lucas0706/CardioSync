import { Tabs } from 'expo-router'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Ionicons from '@expo/vector-icons/Ionicons'

import { theme } from '@/theme'

export default function TabsLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          theme.colors.primary,

        tabBarInactiveTintColor:
          theme.colors.textSecondary,

        tabBarStyle: {
          height:
            72 + insets.bottom,
          paddingTop: theme.spacing.sm,
          paddingBottom:
            insets.bottom +
            theme.spacing.sm,
          backgroundColor:
            theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor:
            theme.colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarLabelStyle: {
          fontFamily:
            theme.typography.medium,
          fontSize:
            theme.typography.small,
          marginTop: 2,
        },

        tabBarItemStyle: {
          minHeight: 56,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? 'home'
                  : 'home-outline'
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="measurements"
        options={{
          title: 'Registros',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? 'list'
                  : 'list-outline'
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? 'person'
                  : 'person-outline'
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: 'Más',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? 'ellipsis-horizontal'
                  : 'ellipsis-horizontal-outline'
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}
