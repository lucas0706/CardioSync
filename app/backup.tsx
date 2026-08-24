import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'

import {
  Screen,
  Text,
} from '@/components/ui'

import {
  saveManualSQLiteBackup,
  type ManualBackupResult,
} from '@/features/backup/services/ManualBackupService'

import { theme } from '@/theme'

export default function BackupScreen() {
  const [running, setRunning] = useState(false)

  const [result, setResult] =
    useState<ManualBackupResult | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  async function handleManualBackup() {
    if (running) {
      return
    }

    setRunning(true)
    setResult(null)
    setError(null)

    try {
      const backup =
        await saveManualSQLiteBackup()

      if (!backup) {
        return
      }

      setResult(backup)
    } catch (backupError) {
      const message =
        backupError instanceof Error
          ? backupError.message
          : 'No se pudo crear la copia de seguridad.'

      setError(message)
    } finally {
      setRunning(false)
    }
  }

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
              Copias de seguridad
            </Text>

            <Text style={styles.subtitle}>
              Protegé los datos de CardioSync
              mediante copias de seguridad de
              la base de datos.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              COPIA MANUAL
            </Text>

            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="download-outline"
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.cardTitle}>
                    Guardar una copia
                  </Text>

                  <Text
                    style={
                      styles.cardDescription
                    }
                  >
                    Creá una copia completa de la
                    base de datos y elegí una carpeta
                    de destino.
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled: running,
                }}
                disabled={running}
                onPress={handleManualBackup}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed &&
                    !running &&
                    styles.primaryButtonPressed,
                  running &&
                    styles.primaryButtonDisabled,
                ]}
              >
                <Ionicons
                  name={
                    running
                      ? 'sync-outline'
                      : 'download-outline'
                  }
                  size={19}
                  color="#FFFFFF"
                />

                <Text
                  style={styles.primaryButtonText}
                >
                  {running
                    ? 'Creando copia...'
                    : 'Crear copia manual'}
                </Text>
              </Pressable>
            </View>
          </View>

          {result ? (
            <View
              style={[
                styles.statusCard,
                styles.successCard,
              ]}
            >
              <View style={styles.statusIcon}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color={theme.colors.success}
                />
              </View>

              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  Copia creada correctamente
                </Text>

                <Text
                  style={styles.statusDescription}
                >
                  {result.fileName}
                </Text>

                <Text style={styles.statusMeta}>
                  {result.measurementCount}{' '}
                  {result.measurementCount === 1
                    ? 'medición'
                    : 'mediciones'}{' '}
                  respaldadas.
                </Text>
              </View>
            </View>
          ) : null}

          {error ? (
            <View
              style={[
                styles.statusCard,
                styles.errorCard,
              ]}
            >
              <View style={styles.statusIcon}>
                <Ionicons
                  name="alert-circle-outline"
                  size={24}
                  color={theme.colors.danger}
                />
              </View>

              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  No se pudo crear la copia
                </Text>

                <Text
                  style={styles.statusDescription}
                >
                  {error}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              PRÓXIMAMENTE
            </Text>

            <View style={styles.card}>
              <BackupOption
                icon="logo-google"
                title="Google Drive"
                description="Guardar automáticamente una copia en Google Drive."
                disabled
              />

              <View style={styles.divider} />

              <BackupOption
                icon="time-outline"
                title="Copias programadas"
                description="Configurar cuándo crear las copias de seguridad."
                disabled
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.colors.textSecondary}
            />

            <Text style={styles.infoText}>
              La copia contiene la base SQLite
              completa de CardioSync. Android
              permite elegir la carpeta de destino
              mediante su selector de almacenamiento.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

type BackupOptionProps = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  disabled?: boolean
}

function BackupOption({
  icon,
  title,
  description,
  disabled = false,
}: BackupOptionProps) {
  return (
    <View
      style={[
        styles.option,
        disabled && styles.optionDisabled,
      ]}
    >
      <View style={styles.optionIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>

      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>
          {title}
        </Text>

        <Text
          style={styles.optionDescription}
        >
          {description}
        </Text>
      </View>

      <Text style={styles.comingSoon}>
        Próximamente
      </Text>
    </View>
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
    fontFamily: theme.typography.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.body,
    lineHeight: 22,
    color: theme.colors.textSecondary,
  },

  section: {
    gap: theme.spacing.sm,
  },

  sectionLabel: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.overline,
    lineHeight: 16,
    letterSpacing: 0.6,
    color: theme.colors.textSecondary,
  },

  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },

  iconContainer: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor:
      theme.colors.primary + '12',
  },

  textContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  cardTitle: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
    lineHeight: 21,
    color: theme.colors.text,
  },

  cardDescription: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
    lineHeight: 18,
    color: theme.colors.textSecondary,
  },

  primaryButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },

  primaryButtonPressed: {
    opacity: 0.85,
  },

  primaryButtonDisabled: {
    opacity: 0.55,
  },

  primaryButtonText: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
    color: '#FFFFFF',
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
  },

  successCard: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.surface,
  },

  errorCard: {
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.surface,
  },

  statusIcon: {
    paddingTop: 1,
  },

  statusContent: {
    flex: 1,
    gap: 3,
  },

  statusTitle: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },

  statusDescription: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
    lineHeight: 18,
    color: theme.colors.textSecondary,
  },

  statusMeta: {
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 54,
    backgroundColor: theme.colors.border,
  },

  option: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  optionDisabled: {
    opacity: 0.55,
  },

  optionIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionContent: {
    flex: 1,
    gap: 2,
  },

  optionTitle: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },

  optionDescription: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
    lineHeight: 17,
    color: theme.colors.textSecondary,
  },

  comingSoon: {
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
  },

  infoText: {
    flex: 1,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
    lineHeight: 18,
    color: theme.colors.textSecondary,
  },
})
