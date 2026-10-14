import { AppVersionService } from './AppVersionService'

import { GitHubReleaseService } from './GitHubReleaseService'

export interface UpdateCheckResult {
  currentVersion: string

  latestVersion: string

  updateAvailable: boolean

  releaseUrl: string

  releaseNotes: string

  apkAsset?: {
    id: number
    name: string
    downloadUrl: string
    size: number
    digest: string | null
  }
}

export class UpdateCheckerService {
  static async check(installedVersion?: string): Promise<UpdateCheckResult | undefined> {
    const currentVersion = installedVersion ?? AppVersionService.getInstalledVersion()

    const release = await GitHubReleaseService.getLatestRelease()

    if (!release) {
      return undefined
    }

    const latestVersion = release.tag_name.trim().replace(/^v/i, '')
    const parsedLatest = AppVersionService.parseVersion(latestVersion)

    if (!parsedLatest) {
      throw new Error(`La etiqueta "${release.tag_name}" no es una versión estable válida.`)
    }

    const updateAvailable = AppVersionService.isNewerVersion(currentVersion, latestVersion)

    const apkAssets = release.assets.filter(
      (asset) =>
        asset.name.toLowerCase().endsWith('.apk') &&
        asset.content_type === 'application/vnd.android.package-archive',
    )

    if (apkAssets.length > 1) {
      throw new Error('El release contiene varias APK y no se puede elegir una de forma segura.')
    }

    const apkAsset = apkAssets[0]

    if (
      apkAsset &&
      !isTrustedReleaseAssetUrl(apkAsset.browser_download_url, apkAsset.name, release.tag_name)
    ) {
      throw new Error('La URL de descarga del APK no pertenece al release esperado.')
    }

    return {
      currentVersion,

      latestVersion,

      updateAvailable,

      releaseUrl: release.html_url,

      releaseNotes: release.body ?? '',

      apkAsset: apkAsset
        ? {
            id: apkAsset.id,
            name: apkAsset.name,
            downloadUrl: apkAsset.browser_download_url,
            size: apkAsset.size,
            digest: apkAsset.digest ?? null,
          }
        : undefined,
    }
  }
}

function isTrustedReleaseAssetUrl(url: string, assetName: string, tagName: string): boolean {
  try {
    const parsed = new URL(url)
    const pathSegments = parsed.pathname.split('/').filter(Boolean)
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === 'github.com' &&
      pathSegments.length === 6 &&
      pathSegments[0] === 'lucas0706' &&
      pathSegments[1] === 'CardioSync' &&
      pathSegments[2] === 'releases' &&
      pathSegments[3] === 'download' &&
      decodeURIComponent(pathSegments[4]) === tagName &&
      decodeURIComponent(pathSegments[5]) === assetName
    )
  } catch {
    return false
  }
}
