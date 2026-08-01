import { Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'

import { Screen, Text } from '@/components/ui'

export default function MoreScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Más</Text>

        <Pressable
          style={styles.item}
          onPress={() => router.push('/(tabs)/statistics')}
        >
          <Text>📊 Estadísticas</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => router.push('/(tabs)/reports')}
        >
          <Text>📄 Reportes</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <Text>⚙️ Configuración</Text>
        </Pressable>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },

  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
  },
})
