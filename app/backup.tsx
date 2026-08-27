import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { useEffect, useState } from 'react'

import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'

import {
  Screen,
  Text,
} from '@/components/ui'

import {
  saveManualSQLiteBackup,
  type ManualBackupResult,
} from '@/features/backup/services/ManualBackupService'

import {
  restoreCardioSyncBackup,
  validateCardioSyncBackup,
  type CardioSyncRestoreValidation,
} from '@/features/backup/services/CardioSyncRestoreService'

import {
  createGoogleDriveBackup,
  type GoogleDriveBackupResult,
} from '@/features/backup/services/GoogleDriveService'

import {
  getGoogleCurrentUser,
  isGoogleSignInCancelled,
  signInWithGoogle,
  signOutFromGoogle,
  type GoogleAccount,
} from '@/core/auth/googleAuthService'

import { theme } from '@/theme'

export default function BackupScreen() {
  const [running, setRunning] = useState(false)

  const [restoring, setRestoring] =
    useState(false)

  const [result, setResult] =
    useState<ManualBackupResult | null>(null)

  const [googleDriveRunning, setGoogleDriveRunning] =
    useState(false)

  const [googleDriveResult, setGoogleDriveResult] =
    useState<GoogleDriveBackupResult | null>(null)

  const [googleDriveError, setGoogleDriveError] =
    useState<string | null>(null)

  const [googleAccount, setGoogleAccount] =
    useState<GoogleAccount | null>(null)

  const [googleAuthLoading, setGoogleAuthLoading] =
    useState(true)

  const [googleAuthError, setGoogleAuthError] =
    useState<string | null>(null)

  const [restoreValidation, setRestoreValidation] =
    useState<CardioSyncRestoreValidation | null>(
      null,
    )

  const [restoreFileName, setRestoreFileName] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const [restoreError, setRestoreError] =
    useState<string | null>(null)

  useEffect(() => {
    void loadGoogleAccount()
  }, [])

  async function loadGoogleAccount(): Promise<void> {
    setGoogleAuthLoading(true)
    setGoogleAuthError(null)

    try {
      const account =
        await getGoogleCurrentUser()

      setGoogleAccount(account)
    } catch (authError) {
      console.error(
        'Google auth state error:',
        authError,
      )

      setGoogleAccount(null)
      setGoogleAuthError(
        'No se pudo comprobar la conexión con Google.',
      )
    } finally {
      setGoogleAuthLoading(false)
    }
  }

  async function handleGoogleSignIn(): Promise<void> {
    if (
      googleAuthLoading ||
      googleDriveRunning ||
      running ||
      restoring
    ) {
      return
    }

    setGoogleAuthLoading(true)
    setGoogleAuthError(null)

    try {
      const result =
        await signInWithGoogle()

      if (result.type !== 'success') {
        return
      }

      const account =
        await getGoogleCurrentUser()

      setGoogleAccount(account)
    } catch (authError) {
      if (
        isGoogleSignInCancelled(authError)
      ) {
        return
      }

      console.error(
        'Google Sign-In error:',
        authError,
      )

      setGoogleAuthError(
        'No se pudo conectar Google Drive.',
      )
    } finally {
      setGoogleAuthLoading(false)
    }
  }

  async function handleGoogleSignOut(): Promise<void> {
    if (googleAuthLoading) {
      return
    }

    setGoogleAuthLoading(true)
    setGoogleAuthError(null)
    setGoogleDriveResult(null)
    setGoogleDriveError(null)

    try {
      await signOutFromGoogle()
      setGoogleAccount(null)
    } catch (authError) {
      console.error(
        'Google Sign-Out error:',
        authError,
      )

      setGoogleAuthError(
        'No se pudo desconectar Google Drive.',
      )
    } finally {
      setGoogleAuthLoading(false)
    }
  }

  async function handleManualBackup() {
    if (running || restoring) {
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

  async function handleGoogleDriveBackup() {
    if (
      running ||
      restoring ||
      googleDriveRunning ||
      !googleAccount
    ) {
      return
    }

    setGoogleDriveRunning(true)
    setGoogleDriveResult(null)
    setGoogleDriveError(null)

    try {
      const backup =
        await createGoogleDriveBackup()

      setGoogleDriveResult(backup)
    } catch (backupError) {
      const message =
        backupError instanceof Error
          ? backupError.message
          : 'No se pudo crear la copia de seguridad en Google Drive.'

      setGoogleDriveError(message)
    } finally {
      setGoogleDriveRunning(false)
    }
  }

  async function handleSelectRestoreBackup() {
    if (running || restoring) {
      return
    }

    setRestoreValidation(null)
    setRestoreFileName(null)
    setRestoreError(null)

    try {
      const selection =
        await DocumentPicker.getDocumentAsync({
          type: 'application/octet-stream',
          copyToCacheDirectory: true,
          multiple: false,
        })

      if (selection.canceled) {
        return
      }

      const asset = selection.assets[0]

      if (!asset) {
        throw new Error(
          'El selector no devolvió ningún archivo.',
        )
      }

      setRestoreFileName(asset.name)

      const validation =
        await validateCardioSyncBackup(
          asset.uri,
        )

      if (!validation.valid) {
        setRestoreValidation(validation)
        setRestoreError(
          validation.error ??
            'El archivo seleccionado no es una copia válida de CardioSync.',
        )
        return
      }

      setRestoreValidation(validation)

      Alert.alert(
        'Restaurar copia de seguridad',
        `La copia contiene ${validation.measurementCount} ${
          validation.measurementCount === 1
            ? 'medición'
            : 'mediciones'
        }.\n\nLa restauración reemplazará la base de datos actual de CardioSync. Los datos actuales que no estén incluidos en esta copia se perderán.`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Restaurar',
            style: 'destructive',
            onPress: () => {
              void handleRestoreBackup(
                asset.uri,
              )
            },
          },
        ],
      )
    } catch (restoreSelectionError) {
      const message =
        restoreSelectionError instanceof Error
          ? restoreSelectionError.message
          : 'No se pudo seleccionar o validar la copia de seguridad.'

      setRestoreError(message)
    }
  }

  async function handleRestoreBackup(
    sourceUri: string,
  ) {
    if (restoring || running) {
      return
    }

    setRestoring(true)
    setRestoreError(null)

    try {
      const restored =
        await restoreCardioSyncBackup(
          sourceUri,
        )

      setRestoreValidation(
        (current) =>
          current
            ? {
                ...current,
                valid: true,
                measurementCount:
                  restored.measurementCount,
              }
            : current,
      )
    } catch (restoreBackupError) {
      const message =
        restoreBackupError instanceof Error
          ? restoreBackupError.message
          : 'No se pudo restaurar la copia de seguridad.'

      setRestoreError(message)
    } finally {
      setRestoring(false)
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
                  disabled:
                    running || restoring,
                }}
                disabled={
                  running || restoring
                }
                onPress={handleManualBackup}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed &&
                    !running &&
                    !restoring &&
                    styles.primaryButtonPressed,
                  (running || restoring) &&
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
              RESTAURACIÓN
            </Text>

            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    styles.restoreIconContainer,
                  ]}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={24}
                    color={theme.colors.warning}
                  />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.cardTitle}>
                    Restaurar una copia
                  </Text>

                  <Text
                    style={
                      styles.cardDescription
                    }
                  >
                    Seleccioná una copia .db creada
                    por CardioSync para reemplazar
                    la base de datos actual.
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled:
                    running || restoring,
                }}
                disabled={
                  running || restoring
                }
                onPress={
                  handleSelectRestoreBackup
                }
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed &&
                    !running &&
                    !restoring &&
                    styles.secondaryButtonPressed,
                  (running || restoring) &&
                    styles.secondaryButtonDisabled,
                ]}
              >
                {restoring ? (
                  <ActivityIndicator
                    color={theme.colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="folder-open-outline"
                    size={19}
                    color={theme.colors.primary}
                  />
                )}

                <Text
                  style={styles.secondaryButtonText}
                >
                  {restoring
                    ? 'Restaurando...'
                    : 'Seleccionar copia'}
                </Text>
              </Pressable>
            </View>
          </View>

          {restoreFileName &&
          restoreValidation ? (
            <View
              style={[
                styles.statusCard,
                restoreValidation.valid
                  ? styles.successCard
                  : styles.errorCard,
              ]}
            >
              <View style={styles.statusIcon}>
                <Ionicons
                  name={
                    restoreValidation.valid
                      ? 'shield-checkmark-outline'
                      : 'alert-circle-outline'
                  }
                  size={24}
                  color={
                    restoreValidation.valid
                      ? theme.colors.success
                      : theme.colors.danger
                  }
                />
              </View>

              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  {restoreValidation.valid
                    ? 'Copia válida de CardioSync'
                    : 'Copia no válida'}
                </Text>

                <Text
                  style={styles.statusDescription}
                >
                  {restoreFileName}
                </Text>

                {restoreValidation.valid ? (
                  <>
                    <Text
                      style={styles.statusMeta}
                    >
                      {restoreValidation.measurementCount}{' '}
                      {restoreValidation.measurementCount ===
                      1
                        ? 'medición'
                        : 'mediciones'}{' '}
                      encontradas.
                    </Text>

                    <Text
                      style={styles.statusMeta}
                    >
                      Integridad SQLite:{' '}
                      {restoreValidation.integrityCheck}
                    </Text>
                  </>
                ) : null}
              </View>
            </View>
          ) : null}

          {restoreError ? (
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
                  No se pudo restaurar la copia
                </Text>

                <Text
                  style={styles.statusDescription}
                >
                  {restoreError}
                </Text>
              </View>
            </View>
          ) : null}

          {restoreValidation?.valid &&
          !restoring ? (
            <View style={styles.warningCard}>
              <Ionicons
                name="warning-outline"
                size={20}
                color={theme.colors.warning}
              />

              <Text style={styles.warningText}>
                La restauración reemplaza la base
                de datos actual. Después de
                restaurar, cerrá y volvé a abrir
                CardioSync para que la aplicación
                utilice la base restaurada.
              </Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              GOOGLE DRIVE
            </Text>

            <View style={styles.card}>
              {googleAuthLoading ? (
                <View style={styles.authStatusRow}>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />

                  <Text style={styles.authStatusText}>
                    Comprobando conexión con Google...
                  </Text>
                </View>
              ) : googleAccount ? (
                <>
                  <View style={styles.connectedCard}>
                    <View style={styles.connectedIcon}>
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={theme.colors.success}
                      />
                    </View>

                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>
                        Google Drive conectado
                      </Text>

                      <Text style={styles.optionDescription}>
                        {googleAccount.email ??
                          googleAccount.name ??
                          'Cuenta de Google conectada'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.driveFolderInfo}>
                    <Ionicons
                      name="folder-outline"
                      size={19}
                      color={theme.colors.textSecondary}
                    />

                    <View style={styles.optionContent}>
                      <Text style={styles.folderTitle}>
                        Carpeta de destino
                      </Text>

                      <Text style={styles.folderDescription}>
                        Google Drive / CardioSync Backups
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={[
                      styles.option,
                      googleDriveRunning &&
                        styles.optionDisabled,
                    ]}
                    onPress={handleGoogleDriveBackup}
                    disabled={
                      running ||
                      restoring ||
                      googleDriveRunning
                    }
                  >
                    <View style={styles.optionIcon}>
                      {googleDriveRunning ? (
                        <ActivityIndicator
                          size="small"
                          color={theme.colors.primary}
                        />
                      ) : (
                        <Ionicons
                          name="cloud-upload-outline"
                          size={20}
                          color={theme.colors.primary}
                        />
                      )}
                    </View>

                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>
                        {googleDriveRunning
                          ? 'Guardando copia...'
                          : 'Guardar copia ahora'}
                      </Text>

                      <Text style={styles.optionDescription}>
                        {googleDriveRunning
                          ? 'Subiendo la base de datos a Google Drive.'
                          : 'Crear y guardar una nueva copia de seguridad.'}
                      </Text>
                    </View>

                    {!googleDriveRunning ? (
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    ) : null}
                  </Pressable>

                  <Pressable
                    style={styles.disconnectButton}
                    onPress={() => {
                      void handleGoogleSignOut()
                    }}
                    disabled={
                      googleAuthLoading ||
                      googleDriveRunning
                    }
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={18}
                      color={theme.colors.danger}
                    />

                    <Text style={styles.disconnectText}>
                      Desconectar Google Drive
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={[
                      styles.option,
                      googleAuthLoading &&
                        styles.optionDisabled,
                    ]}
                    onPress={() => {
                      void handleGoogleSignIn()
                    }}
                    disabled={
                      googleAuthLoading ||
                      running ||
                      restoring ||
                      googleDriveRunning
                    }
                  >
                    <View style={styles.optionIcon}>
                      <Ionicons
                        name="logo-google"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>

                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>
                        Conectar Google Drive
                      </Text>

                      <Text style={styles.optionDescription}>
                        Conectá tu cuenta de Google para guardar copias de seguridad.
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </Pressable>

                  <View style={styles.driveFolderInfo}>
                    <Ionicons
                      name="folder-outline"
                      size={19}
                      color={theme.colors.textSecondary}
                    />

                    <View style={styles.optionContent}>
                      <Text style={styles.folderTitle}>
                        Carpeta de destino
                      </Text>

                      <Text style={styles.folderDescription}>
                        Google Drive / CardioSync Backups
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {googleAuthError ? (
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
                      Problema con Google Drive
                    </Text>

                    <Text style={styles.statusDescription}>
                      {googleAuthError}
                    </Text>
                  </View>
                </View>
              ) : null}

              {googleDriveResult ? (
                <View style={styles.successCard}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={theme.colors.success}
                  />

                  <View style={styles.statusContent}>
                    <Text style={styles.statusTitle}>
                      Copia guardada en Google Drive
                    </Text>

                    <Text style={styles.statusDescription}>
                      {googleDriveResult.fileName}
                    </Text>

                    <Text style={styles.statusMeta}>
                      {googleDriveResult.measurementCount}{' '}
                      {googleDriveResult.measurementCount === 1
                        ? 'medición'
                        : 'mediciones'}
                    </Text>
                  </View>
                </View>
              ) : null}

              {googleDriveError ? (
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
                      No se pudo guardar en Google Drive
                    </Text>

                    <Text style={styles.statusDescription}>
                      {googleDriveError}
                    </Text>
                  </View>
                </View>
              ) : null}

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

  restoreIconContainer: {
    backgroundColor:
      theme.colors.warning + '14',
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

  secondaryButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },

  secondaryButtonPressed: {
    opacity: 0.75,
  },

  secondaryButtonDisabled: {
    opacity: 0.55,
  },

  secondaryButtonText: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
    color: theme.colors.primary,
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

  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.warning,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  warningText: {
    flex: 1,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
    lineHeight: 18,
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

  authStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },

  authStatusText: {
    flex: 1,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },

  connectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },

  connectedIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  driveFolderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
  },

  folderTitle: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    lineHeight: 17,
    color: theme.colors.text,
  },

  folderDescription: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    lineHeight: 17,
    color: theme.colors.textSecondary,
  },

  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  disconnectText: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    color: theme.colors.danger,
  },

  optionDisabled: {
    opacity: 0.55,
  },

  optionPressed: {
    opacity: 0.7,
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

  scheduledContainer: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  scheduledHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  scheduledError: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
    lineHeight: 18,
    color: theme.colors.danger,
  },

  scheduleToggle: {
    width: 48,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
  },

  scheduleToggleActive: {
    backgroundColor: theme.colors.primary,
  },

  scheduleToggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.surface,
  },

  scheduleToggleThumbActive: {
    alignSelf: 'flex-end',
  },

  scheduledDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },

  scheduledRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },

  scheduledRowIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scheduledRowContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  scheduledRowTitle: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
    lineHeight: 21,
    color: theme.colors.text,
  },

  frequencyOptions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },

  frequencyOption: {
    minHeight: 36,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },

  frequencyOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '12',
  },

  frequencyOptionText: {
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
  },

  frequencyOptionTextActive: {
    color: theme.colors.primary,
  },

  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },

  timeOption: {
    minWidth: 72,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },

  timeOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '12',
  },

  timeOptionText: {
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
  },

  timeOptionTextActive: {
    color: theme.colors.primary,
  },

  lastExecutionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
  },

  lastExecutionContent: {
    flex: 1,
    gap: 2,
  },

  lastExecutionTitle: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    lineHeight: 17,
    color: theme.colors.text,
  },

  lastExecutionText: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    lineHeight: 17,
    color: theme.colors.textSecondary,
  },

  lastExecutionError: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    lineHeight: 17,
    color: theme.colors.danger,
  },

  scheduledDisabledText: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
    lineHeight: 18,
    color: theme.colors.textSecondary,
  },

  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  savingText: {
    fontFamily: theme.typography.regular,
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
