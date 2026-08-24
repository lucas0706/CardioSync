import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { router } from 'expo-router'
import { useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'

import {
  Screen,
  Text,
} from '@/components/ui'

import { theme } from '@/theme'

type MenuItemProps = {
  title: string
  description?: string
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
}

function MenuItem({
  title,
  description,
  icon,
  onPress,
}: MenuItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={21}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>
          {title}
        </Text>

        {description ? (
          <Text style={styles.menuDescription}>
            {description}
          </Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={theme.colors.textSecondary}
      />
    </Pressable>
  )
}

export default function MoreScreen() {
  const [
    developmentOpen,
    setDevelopmentOpen,
  ] = useState(false)

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
              Más
            </Text>

            <Text style={styles.subtitle}>
              Herramientas y funciones adicionales
              de CardioSync.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              GENERAL
            </Text>

            <View style={styles.card}>
              <MenuItem
                title="Reportes"
                description="Generar y consultar reportes."
                icon="document-text-outline"
                onPress={() =>
                  router.push('/reports')
                }
              />

              <View style={styles.divider} />

              <MenuItem
                title="Estadísticas"
                description="Analizar las mediciones registradas."
                icon="stats-chart-outline"
                onPress={() =>
                  router.push('/statistics')
                }
              />

              <View style={styles.divider} />

              <MenuItem
                title="Configuración"
                description="Importación, exportación y conexiones."
                icon="settings-outline"
                onPress={() =>
                  router.push('/settings')
                }
              />
            </View>
          </View>

          <View style={styles.developmentSection}>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setDevelopmentOpen(
                  value => !value,
                )
              }
              style={styles.developmentHeader}
            >
              <View
                style={
                  styles.developmentHeaderContent
                }
              >
                <Ionicons
                  name="code-slash-outline"
                  size={18}
                  color={
                    theme.colors.textSecondary
                  }
                />

                <Text
                  style={
                    styles.developmentTitle
                  }
                >
                  Herramientas de desarrollador
                </Text>
              </View>

              <Ionicons
                name={
                  developmentOpen
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={18}
                color={
                  theme.colors.textSecondary
                }
              />
            </Pressable>

            {developmentOpen ? (
              <View
                style={
                  styles.developmentContent
                }
              >
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      '/clinical-test',
                    )
                  }
                  style={styles.devItem}
                >
                  <Text
                    style={
                      styles.devItemTitle
                    }
                  >
                    Clinical Test
                  </Text>

                  <Text
                    style={
                      styles.devItemDescription
                    }
                  >
                    Herramienta interna de
                    validación clínica.
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      '/chart-v3-test',
                    )
                  }
                  style={styles.devItem}
                >
                  <Text
                    style={
                      styles.devItemTitle
                    }
                  >
                    ClinicalChart V3 — Laboratorio
                  </Text>

                  <Text
                    style={
                      styles.devItemDescription
                    }
                  >
                    Probar ejes, escalas y visualización
                    del nuevo gráfico.
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      '/statistics-db-audit',
                    )
                  }
                  style={styles.devItem}
                >
                  <Text
                    style={
                      styles.devItemTitle
                    }
                  >
                    Statistics DB Audit
                  </Text>

                  <Text
                    style={
                      styles.devItemDescription
                    }
                  >
                    Validar las estadísticas calculadas
                    sobre los registros reales de la base.
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      '/sqlite-real-backup-poc',
                    )
                  }
                  style={styles.devItem}
                >
                  <Text
                    style={styles.devItemTitle}
                  >
                    SQLite Real Backup PoC
                  </Text>

                  <Text
                    style={
                      styles.devItemDescription
                    }
                  >
                    Probar backup de la base real
                    sin modificar los registros.
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      '/report-test',
                    )
                  }
                  style={styles.devItem}
                >
                  <Text
                    style={styles.devItemTitle}
                  >
                    Datos de prueba — Reportes
                  </Text>

                  <Text
                    style={
                      styles.devItemDescription
                    }
                  >
                    Datos utilizados durante el
                    desarrollo de Reportes.
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      '/report-redesign-dev',
                    )
                  }
                  style={styles.devItem}
                >
                  <Text
                    style={styles.devItemTitle}
                  >
                    Reporte Redesign V1
                  </Text>

                  <Text
                    style={
                      styles.devItemDescription
                    }
                  >
                    Vista temporal del nuevo diseño
                    del reporte.
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      '/sqlite-real-backup-poc',
                    )
                  }
                  style={styles.devItem}
                >
                  <Text
                    style={styles.devItemTitle}
                  >
                    SQLite Backup PoC
                  </Text>

                  <Text
                    style={styles.devItemDescription}
                  >
                    Validar backup y restauración
                    de bases SQLite.
                  </Text>
                </Pressable>

              </View>
            ) : null}
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

  menuItem: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.sm,
  },

  menuItemPressed: {
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

  menuContent: {
    flex: 1,
    gap: 2,
  },

  menuTitle: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    lineHeight: 21,
    color: theme.colors.text,
  },

  menuDescription: {
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
    marginLeft: 38 + theme.spacing.sm,
    backgroundColor:
      theme.colors.border,
  },

  developmentSection: {
    marginTop: theme.spacing.sm,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      theme.colors.border,
  },

  developmentHeader: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  developmentHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  developmentTitle: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.caption,
    color:
      theme.colors.textSecondary,
  },

  developmentContent: {
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
  },

  devItem: {
    gap: 2,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.sm,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.surface,
  },

  devItemTitle: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.caption,
    color: theme.colors.text,
  },

  devItemDescription: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 17,
    color:
      theme.colors.textSecondary,
  },
})
