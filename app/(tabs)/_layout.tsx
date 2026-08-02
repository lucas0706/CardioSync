import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />

      <Tabs.Screen
        name="measurements"
        options={{
          title: 'Registros',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: 'Más',
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
