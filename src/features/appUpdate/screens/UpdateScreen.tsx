import * as FileSystem from 'expo-file-system/legacy'
import * as IntentLauncher from 'expo-intent-launcher'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native'

import { Button, Card, Screen, ScreenHeader, Text } from '@/components/ui'
import {
  getOtaPreferences,
  setAutomaticOtaEnabled,
} from '@/features/updates/services/OtaPreferencesService'
import { otaUpdateService } from '@/features/updates/services/OtaUpdateService'
import { theme } from '@/theme'

import { useAppUpdate } from '../hooks/useAppUpdate'
import {
  AndroidUpdateInstaller,
  type InstalledAndroidAppInfo,
} from '../services/AndroidUpdateInstaller'
import {
  apkDownloadService,
  type ApkDownloadProgress,
  type ApkDownloadStage,
  type ValidatedApk,
} from '../services/ApkDownloadService'

type DownloadState = 'idle' | 'downloading' | 'validating'

const PACKAGE_NAME = 'com.lucas0706a.CardioSync'
const INSTALL_PACKAGE_ACTION = 'android.intent.action.INSTALL_PACKAGE'
const FLAG_GRANT_READ_URI_PERMISSION = 1

export default function UpdateScreen() {
  const { checking, result, error: releaseError, checkForUpdate } = useAppUpdate()
  const [otaEnabled, setOtaEnabled] = useState<boolean | null>(null)
  const [otaSaving, setOtaSaving] = useState(false)
  const [otaError, setOtaError] = useState<string | null>(null)
  const [otaDownloaded, setOtaDownloaded] = useState(false)
  const [downloadState, setDownloadState] = useState<DownloadState>('idle')
  const [downloadProgress, setDownloadProgress] = useState<ApkDownloadProgress | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [validatedApk, setValidatedApk] = useState<ValidatedApk | null>(null)
  const [installerStatus, setInstallerStatus] = useState<string | null>(null)
  const [installedVersion, setInstalledVersion] = useState<string | null>(null)
  const [installerBusy, setInstallerBusy] = useState(false)

  const handleCheckForUpdate = useCallback(
    (installedVersion?: string) => {
      setValidatedApk(null)
      setInstallerStatus(null)
      setDownloadError(null)
      return checkForUpdate(installedVersion)
    },
    [checkForUpdate],
  )

  useEffect(() => {
    try {
      setOtaEnabled(getOtaPreferences().automaticOtaEnabled)
    } catch (error) {
      setOtaError(getErrorMessage(error, 'No se pudo leer la preferencia OTA.'))
    }

    if (Platform.OS === 'android') {
      void AndroidUpdateInstaller.getInstalledAppInfo()
        .then((appInfo) => {
          setInstalledVersion(appInfo.versionName)
          return handleCheckForUpdate(appInfo.versionName)
        })
        .catch((error: unknown) => {
          console.warn('Could not read installed Android version.', error)
          void handleCheckForUpdate()
        })
      return
    }

    void handleCheckForUpdate()
  }, [handleCheckForUpdate])

  const handleOtaPreferenceChange = useCallback(async (enabled: boolean) => {
    setOtaSaving(true)
    setOtaError(null)

    try {
      const saved = setAutomaticOtaEnabled(enabled)
      setOtaEnabled(saved.automaticOtaEnabled)

      if (enabled) {
        const outcome = await otaUpdateService.checkAndDownloadIfEnabled()
        if (outcome === 'downloaded') {
          setOtaDownloaded(true)
        }
      }
    } catch (error) {
      setOtaError(getErrorMessage(error, 'No se pudo guardar la preferencia OTA.'))
    } finally {
      setOtaSaving(false)
    }
  }, [])

  const handleDownload = useCallback(async () => {
    const asset = result?.apkAsset
    if (!result?.updateAvailable || !asset) {
      return
    }

    setDownloadError(null)
    setInstallerStatus(null)
    setValidatedApk(null)
    setDownloadProgress(null)
    setDownloadState('downloading')

    try {
      const downloaded = await apkDownloadService.downloadAndValidate(
        {
          name: asset.name,
          downloadUrl: asset.downloadUrl,
          size: asset.size,
          digest: asset.digest,
          version: result.latestVersion,
        },
        setDownloadProgress,
        (stage: ApkDownloadStage) => setDownloadState(stage),
      )
      setValidatedApk(downloaded)
      setInstallerStatus('APK validada. Puedes continuar con el instalador de Android.')
    } catch (error) {
      setDownloadError(getErrorMessage(error, 'No se pudo descargar o validar el APK.'))
    } finally {
      setDownloadState('idle')
    }
  }, [result])

  const handleCancelDownload = useCallback(async () => {
    try {
      await apkDownloadService.cancelDownload()
    } catch (error) {
      setDownloadError(getErrorMessage(error, 'No se pudo cancelar la descarga.'))
    }
  }, [])

  const launchInstaller = useCallback(
    async (apk: ValidatedApk) => {
      const contentUri = await FileSystem.getContentUriAsync(apk.fileUri)
      setInstallerStatus('Android abrirá su instalador y solicitará confirmación.')
      const activityResult = await IntentLauncher.startActivityAsync(INSTALL_PACKAGE_ACTION, {
        data: contentUri,
        type: 'application/vnd.android.package-archive',
        flags: FLAG_GRANT_READ_URI_PERMISSION,
      })

      const installed: InstalledAndroidAppInfo = await AndroidUpdateInstaller.getInstalledAppInfo()
      setInstalledVersion(installed.versionName)

      if (installed.versionCode >= apk.inspection.versionCode) {
        setInstallerStatus(`Instalación confirmada. Versión instalada: ${installed.versionName}.`)
        await handleCheckForUpdate(installed.versionName)
        setValidatedApk(null)
        return
      }

      setInstallerStatus(
        activityResult.resultCode === -1
          ? 'Android no confirmó la versión nueva. Puedes volver a intentarlo.'
          : 'La instalación se canceló o no se completó. La aplicación y sus datos se conservaron.',
      )
    },
    [handleCheckForUpdate],
  )

  const handleInstall = useCallback(async () => {
    if (!validatedApk || Platform.OS !== 'android') {
      return
    }

    setInstallerBusy(true)
    setInstallerStatus(null)

    try {
      const canInstall = await AndroidUpdateInstaller.canRequestPackageInstalls()
      if (!canInstall) {
        setInstallerStatus(
          'Para continuar, permite a CardioSync instalar esta actualización en los ajustes de Android. No se concede ningún permiso automáticamente.',
        )
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.MANAGE_UNKNOWN_APP_SOURCES,
          { data: `package:${PACKAGE_NAME}` },
        )

        const permissionGranted = await AndroidUpdateInstaller.canRequestPackageInstalls()
        if (!permissionGranted) {
          setInstallerStatus(
            'La autorización no está habilitada. Puedes volver a intentarlo cuando la permitas en Ajustes.',
          )
          return
        }
      }

      await launchInstaller(validatedApk)
    } catch (error) {
      setInstallerStatus(getErrorMessage(error, 'No se pudo abrir el instalador de Android.'))
    } finally {
      setInstallerBusy(false)
    }
  }, [launchInstaller, validatedApk])

  const handleOpenRelease = useCallback(async () => {
    if (!result) {
      return
    }

    try {
      await Linking.openURL(result.releaseUrl)
    } catch (error) {
      setDownloadError(getErrorMessage(error, 'No se pudo abrir el release de GitHub.'))
    }
  }, [result])

  const handleApplyOta = useCallback(async () => {
    try {
      await otaUpdateService.applyDownloadedUpdate()
    } catch (error) {
      setOtaError(getErrorMessage(error, 'No se pudo aplicar la actualización OTA.'))
    }
  }, [])

  const statusLabel = result?.updateAvailable
    ? '🟠 Actualización disponible'
    : '🟢 Aplicación actualizada'
  const isDownloading = downloadState === 'downloading'

  return (
    <Screen>
      <ScreenHeader
        title="Actualizaciones"
        subtitle="Consulta versiones APK publicadas en GitHub y controla las actualizaciones OTA."
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Card>
            <Text style={styles.sectionTitle}>Actualizaciones OTA automáticas</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text>
                  {otaEnabled === null
                    ? 'Cargando preferencia…'
                    : otaEnabled
                      ? 'Activadas'
                      : 'Desactivadas'}
                </Text>
                <Text style={styles.secondaryText}>
                  {otaEnabled
                    ? 'Se comprobarán y descargarán después de iniciar la app. La aplicación no se reinicia sin tu acción.'
                    : 'No se comprobarán ni descargarán automáticamente. Buscar versiones APK en GitHub sigue disponible.'}
                </Text>
              </View>
              <Switch
                value={otaEnabled ?? false}
                disabled={otaEnabled === null || otaSaving}
                onValueChange={(enabled) => void handleOtaPreferenceChange(enabled)}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                accessibilityLabel="Actualizaciones OTA automáticas"
              />
            </View>
            {otaSaving ? <ActivityIndicator style={styles.inlineProgress} /> : null}
            {otaError ? <Text style={styles.error}>{otaError}</Text> : null}
            {otaDownloaded ? (
              <View style={styles.otaReady}>
                <Text>
                  Hay una OTA descargada. Desactivar las descargas automáticas no revierte esta
                  descarga; Expo podría aplicarla al próximo inicio en frío.
                </Text>
                <Button title="Aplicar ahora" onPress={() => void handleApplyOta()} />
                <Button title="Más tarde" onPress={() => setOtaDownloaded(false)} />
              </View>
            ) : null}
          </Card>

          {checking ? (
            <Card>
              <View style={styles.centered}>
                <ActivityIndicator />
                <Text>Buscando versiones APK en GitHub…</Text>
              </View>
            </Card>
          ) : null}

          {releaseError ? (
            <Card>
              <Text style={styles.error}>{releaseError}</Text>
              <View style={styles.actions}>
                <Button
                  title="Buscar actualizaciones"
                  onPress={() => void handleCheckForUpdate()}
                />
              </View>
            </Card>
          ) : null}

          {result ? (
            <>
              <Card>
                <Text style={styles.sectionTitle}>Versión</Text>
                <Text>Instalada: {installedVersion ?? result.currentVersion}</Text>
                <Text>Última publicada: {result.latestVersion}</Text>
                <Text style={styles.status}>{statusLabel}</Text>
              </Card>

              <Card>
                <Text style={styles.sectionTitle}>Novedades</Text>
                <Text>{result.releaseNotes || 'Sin notas de lanzamiento.'}</Text>
              </Card>

              <Card>
                <Text style={styles.sectionTitle}>APK de GitHub Releases</Text>
                <View style={styles.actions}>
                  <Button title="Ver release" onPress={() => void handleOpenRelease()} />
                  <Button
                    title="Buscar actualizaciones"
                    onPress={() => void handleCheckForUpdate()}
                  />
                </View>

                {result.updateAvailable && result.apkAsset && Platform.OS === 'android' ? (
                  <View style={styles.actions}>
                    {downloadState === 'validating' ? (
                      <View style={styles.centered}>
                        <ActivityIndicator />
                        <Text>Validando paquete, versión, firma y SHA-256…</Text>
                      </View>
                    ) : isDownloading ? (
                      <>
                        <Text>Descargando APK: {formatProgress(downloadProgress)}</Text>
                        {downloadProgress?.fraction !== null &&
                        downloadProgress?.fraction !== undefined ? (
                          <View style={styles.progressTrack}>
                            <View
                              style={[
                                styles.progressBar,
                                { width: `${downloadProgress.fraction * 100}%` },
                              ]}
                            />
                          </View>
                        ) : null}
                        <Button
                          title="Cancelar descarga"
                          onPress={() => void handleCancelDownload()}
                        />
                      </>
                    ) : validatedApk ? (
                      installerBusy ? (
                        <View style={styles.centered}>
                          <ActivityIndicator />
                          <Text>Esperando al instalador de Android…</Text>
                        </View>
                      ) : (
                        <Button title="Instalar APK" onPress={() => void handleInstall()} />
                      )
                    ) : (
                      <Button title="Descargar APK" onPress={() => void handleDownload()} />
                    )}
                    <Text style={styles.secondaryText}>
                      El APK solo se instala después de validar paquete, versión, firma y tamaño;
                      Android siempre solicita confirmación.
                    </Text>
                  </View>
                ) : result.updateAvailable && result.apkAsset ? (
                  <Text style={styles.secondaryText}>
                    La descarga e instalación de APK solo está disponible en Android.
                  </Text>
                ) : result.updateAvailable ? (
                  <Text style={styles.secondaryText}>
                    El release no contiene una APK única y verificable. No se ofrecerá descarga.
                  </Text>
                ) : null}

                {downloadError ? <Text style={styles.error}>{downloadError}</Text> : null}
                {installerStatus ? (
                  <Text style={styles.secondaryText}>{installerStatus}</Text>
                ) : null}
              </Card>
            </>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  )
}

function formatProgress(progress: ApkDownloadProgress | null): string {
  if (!progress) {
    return 'preparando…'
  }
  if (progress.fraction === null) {
    return `${formatBytes(progress.bytesWritten)} descargados`
  }
  return `${Math.round(progress.fraction * 100)}% (${formatBytes(progress.bytesWritten)} de ${formatBytes(progress.totalBytes)})`
}

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    marginBottom: 12,
    fontFamily: theme.typography.semiBold,
  },
  centered: {
    alignItems: 'center',
    gap: 12,
  },
  status: {
    marginTop: 8,
    fontFamily: theme.typography.semiBold,
  },
  error: {
    marginTop: 8,
    color: theme.colors.danger,
  },
  secondaryText: {
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  actions: {
    gap: 10,
    marginTop: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchText: {
    flex: 1,
    gap: 4,
  },
  inlineProgress: {
    marginTop: 12,
  },
  otaReady: {
    gap: 8,
    marginTop: 12,
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
})
