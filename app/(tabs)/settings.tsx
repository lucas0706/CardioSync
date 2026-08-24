import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { router } from 'expo-router'

import Ionicons from '@expo/vector-icons/Ionicons'

import {
  Screen,
  Text,
} from '@/components/ui'

import { theme } from '@/theme'

type SettingsItemProps = {
  title: string
  description: string
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
}

function SettingsItem({
  title,
  description,
  icon,
  onPress,
}: SettingsItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={21}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {title}
        </Text>

        <Text style={styles.itemDescription}>
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={theme.colors.textSecondary}
      />
    </Pressable>
  )
}

export default function SettingsScreen() {
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Configuración
            </Text>

            <Text style={styles.subtitle}>
              Gestioná los datos, las copias de
              seguridad y las conexiones de
              CardioSync.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              DATOS
            </Text>

            <View style={styles.card}>
              <SettingsItem
                title="Importar y exportar"
                description="Importar registros y exportar los datos de CardioSync."
                icon="swap-vertical-outline"
                onPress={() =>
                  router.push('/import')
                }
              />

              <View style={styles.divider} />

              <SettingsItem
                title="Copias de seguridad"
                description="Crear y gestionar copias de seguridad locales."
                icon="cloud-upload-outline"
                onPress={() =>
                  router.push(
                    '/backup',
                  )
                }
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              CONEXIONES
            </Text>

            <View style={styles.card}>
              <SettingsItem
                title="Health Connect"
                description="Conectar CardioSync con los datos de salud de Android."
                icon="heart-outline"
                onPress={() => {
                  // Se implementará en una fase posterior.
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80,
  },

  container: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  header: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.md,
  },

  title: {
    fontFamily:
      theme.typography.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    lineHeight: 22,
    color:
      theme.colors.textSecondary,
  },

  section: {
    gap: theme.spacing.sm,
  },

  sectionLabel: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.overline,
    lineHeight: 16,
    letterSpacing: 0.6,
    color:
      theme.colors.textSecondary,
  },

  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
  },

  item: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.sm,
  },

  itemPressed: {
    opacity: 0.7,
  },

  iconContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor:
      theme.colors.primary + '12',
  },

  itemContent: {
    flex: 1,
    gap: 2,
  },

  itemTitle: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    lineHeight: 21,
    color: theme.colors.text,
  },

  itemDescription: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 17,
    color:
      theme.colors.textSecondary,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft:
      38 + theme.spacing.sm,
    backgroundColor:
      theme.colors.border,
  },
})
