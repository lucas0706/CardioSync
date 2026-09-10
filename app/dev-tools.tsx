import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

type DevRoute = {
  label: string
  route: string
}

const routes: DevRoute[] = [
  { label: 'Google Auth Test', route: '/google-auth-test' },
  { label: 'Backup', route: '/backup' },
  { label: 'Import', route: '/import' },
  { label: 'Chart V3 Test', route: '/chart-v3-test' },
  { label: 'Clinical Test', route: '/clinical-test' },
  { label: 'Report Test', route: '/report-test' },
  { label: 'Report Redesign Dev', route: '/report-redesign-dev' },
  { label: 'Statistics DB Audit', route: '/statistics-db-audit' },
  { label: 'Visual V2', route: '/visual-v2' },
  { label: 'Clear Records', route: '/clear-records' },
  { label: 'Nueva medición', route: '/measurement/new' },
]

export default function DevToolsScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DESARROLLO</Text>
        <Text style={styles.title}>Dev Tools</Text>
        <Text style={styles.subtitle}>
          Acceso rápido a las rutas de prueba de CardioSync.
        </Text>
      </View>

      <View style={styles.list}>
        {routes.map((item) => (
          <Pressable
            key={item.route}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push(item.route as never)}
          >
            <Text style={styles.buttonLabel}>{item.label}</Text>
            <Text style={styles.route}>{item.route}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.backLabel}>Volver</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 56,
    backgroundColor: '#F8FAFC',
  },

  header: {
    marginBottom: 28,
  },

  eyebrow: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#64748B',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
  },

  list: {
    gap: 12,
  },

  button: {
    minHeight: 68,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },

  route: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },

  backButton: {
    marginTop: 28,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },

  backLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
})
