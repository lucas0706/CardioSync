import * as FileSystem from 'expo-file-system/legacy'

import type { AndroidApkInspection } from './AndroidUpdateInstaller'
import { AndroidUpdateInstaller } from './AndroidUpdateInstaller'

export type ApkDownloadProgress = {
  fraction: number | null
  bytesWritten: number
  totalBytes: number
}

export type ValidatedApk = {
  fileUri: string
  inspection: AndroidApkInspection
}

export type ApkDownloadStage = 'downloading' | 'validating'

type ApkAssetInput = {
  name: string
  downloadUrl: string
  size: number
  digest: string | null
  version: string
}

class ApkDownloadService {
  private task?: FileSystem.DownloadResumable
  private activeFileUri?: string
  private cancelRequested = false

  async downloadAndValidate(
    asset: ApkAssetInput,
    onProgress: (progress: ApkDownloadProgress) => void,
    onStage: (stage: ApkDownloadStage) => void,
  ): Promise<ValidatedApk> {
    if (this.task) {
      throw new Error('Ya hay una descarga de APK en curso.')
    }

    if (!FileSystem.cacheDirectory) {
      throw new Error('El almacenamiento temporal de la aplicación no está disponible.')
    }

    if (!Number.isSafeInteger(asset.size) || asset.size <= 0) {
      throw new Error('GitHub no proporcionó un tamaño válido para el APK.')
    }

    const fileName = `cardiosync-update-${Date.now()}.apk`
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`
    this.activeFileUri = fileUri

    const task = FileSystem.createDownloadResumable(
      asset.downloadUrl,
      fileUri,
      {
        headers: {
          Accept: 'application/octet-stream',
        },
      },
      (progress) => {
        const totalBytes = progress.totalBytesExpectedToWrite
        const bytesWritten = progress.totalBytesWritten
        onProgress({
          bytesWritten,
          totalBytes,
          fraction: totalBytes > 0 ? Math.min(bytesWritten / totalBytes, 1) : null,
        })
      },
    )
    this.task = task
    this.cancelRequested = false

    try {
      const result = await task.downloadAsync()

      if (this.cancelRequested) {
        throw new Error('La descarga fue cancelada.')
      }

      if (!result) {
        throw new Error('La descarga del APK fue cancelada.')
      }

      onStage('validating')
      const fileInfo = await FileSystem.getInfoAsync(result.uri)
      if (!fileInfo.exists || fileInfo.size !== asset.size) {
        throw new Error('El tamaño del APK descargado no coincide con GitHub Releases.')
      }

      const inspection = await AndroidUpdateInstaller.inspectApk(result.uri)

      if (inspection.packageName !== 'com.lucas0706a.CardioSync') {
        throw new Error('El APK no pertenece al paquete oficial de CardioSync.')
      }

      if (inspection.versionName.replace(/^v/i, '') !== asset.version) {
        throw new Error('La versión dentro del APK no coincide con la versión del release.')
      }

      if (inspection.versionCode <= inspection.installedVersionCode) {
        throw new Error('El versionCode del APK no es superior al instalado.')
      }

      if (!inspection.signatureCompatible) {
        throw new Error('La firma del APK no es compatible con la aplicación instalada.')
      }

      if (asset.digest) {
        const expectedDigest = /^sha256:([a-f0-9]{64})$/i.exec(asset.digest)?.[1]
        if (!expectedDigest || inspection.sha256.toLowerCase() !== expectedDigest.toLowerCase()) {
          throw new Error('La verificación SHA-256 del APK no coincide con GitHub Releases.')
        }
      }

      this.activeFileUri = result.uri
      return {
        fileUri: result.uri,
        inspection,
      }
    } catch (error) {
      if (this.activeFileUri) {
        await FileSystem.deleteAsync(this.activeFileUri, { idempotent: true }).catch(
          (cleanupError: unknown) => {
            console.error('Could not remove incomplete APK download.', cleanupError)
          },
        )
      }
      if (this.cancelRequested) {
        throw new Error('La descarga fue cancelada.')
      }
      throw error
    } finally {
      this.task = undefined
      this.cancelRequested = false
    }
  }

  async cancelDownload(): Promise<void> {
    const task = this.task
    if (!task) {
      return
    }

    this.cancelRequested = true
    await task.cancelAsync()
  }
}

export const apkDownloadService = new ApkDownloadService()
