import { NativeModules, Platform } from 'react-native'

export type InstalledAndroidAppInfo = {
  packageName: string
  versionName: string
  versionCode: number
}

export type AndroidApkInspection = InstalledAndroidAppInfo & {
  installedVersionCode: number
  sha256: string
  signatureCompatible: boolean
}

type UpdateInstallerNativeModule = {
  canRequestPackageInstalls(): Promise<boolean>
  getInstalledAppInfo(): Promise<InstalledAndroidAppInfo>
  inspectApk(filePath: string): Promise<AndroidApkInspection>
}

const nativeModuleCandidate: unknown = NativeModules.CardioSyncUpdateInstaller
const nativeModule = isUpdateInstallerNativeModule(nativeModuleCandidate)
  ? nativeModuleCandidate
  : null

function requireAndroidModule(): UpdateInstallerNativeModule {
  if (Platform.OS !== 'android') {
    throw new Error('La instalación de APK solo está disponible en Android.')
  }

  if (!nativeModule) {
    throw new Error(
      'La APK instalada no incluye el módulo de validación. Instale una versión base compatible.',
    )
  }

  return nativeModule
}

function isUpdateInstallerNativeModule(value: unknown): value is UpdateInstallerNativeModule {
  if (!value || typeof value !== 'object') {
    return false
  }

  const module = value as Partial<UpdateInstallerNativeModule>
  return (
    typeof module.canRequestPackageInstalls === 'function' &&
    typeof module.getInstalledAppInfo === 'function' &&
    typeof module.inspectApk === 'function'
  )
}

export class AndroidUpdateInstaller {
  static getInstalledAppInfo(): Promise<InstalledAndroidAppInfo> {
    return requireAndroidModule().getInstalledAppInfo()
  }

  static canRequestPackageInstalls(): Promise<boolean> {
    return requireAndroidModule().canRequestPackageInstalls()
  }

  static inspectApk(filePath: string): Promise<AndroidApkInspection> {
    return requireAndroidModule().inspectApk(filePath)
  }
}
