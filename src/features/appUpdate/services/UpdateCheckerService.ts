import {
  AppVersionService,
} from './AppVersionService'

import {
  GitHubReleaseService,
} from './GitHubReleaseService'

export interface UpdateCheckResult {
  currentVersion: string

  latestVersion: string

  updateAvailable: boolean

  releaseUrl: string

  releaseNotes: string

  apkDownloadUrl?: string
}

export class UpdateCheckerService {
  static async check():
    Promise<
      UpdateCheckResult | undefined
    > {
    const currentVersion =
      AppVersionService.getInstalledVersion()

    const release =
      await GitHubReleaseService.getLatestRelease()

    if (!release) {
      return undefined
    }

    const latestVersion =
      release.tag_name
        .trim()
        .replace(/^v/i, '')

    const updateAvailable =
      AppVersionService.isNewerVersion(
        currentVersion,
        latestVersion,
      )

    const apkAsset =
      release.assets.find(
        asset =>
          asset.name
            .toLowerCase()
            .endsWith('.apk'),
      )

    return {
      currentVersion,

      latestVersion,

      updateAvailable,

      releaseUrl:
        release.html_url,

      releaseNotes:
        release.body ?? '',

      apkDownloadUrl:
        apkAsset
          ?.browser_download_url,
    }
  }
}
