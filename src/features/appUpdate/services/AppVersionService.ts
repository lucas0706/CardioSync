import Constants from 'expo-constants'

import type {
  AppVersion,
} from '../models/AppVersion'

export class AppVersionService {
  static getInstalledVersion(): string {
    return (
      Constants.expoConfig?.version ??
      '0.0.0'
    )
  }

  static parseVersion(
    value: string,
  ): AppVersion | undefined {
    const normalized =
      value
        .trim()
        .replace(/^v/i, '')

    const match =
      normalized.match(
        /^(\d+)\.(\d+)\.(\d+)$/,
      )

    if (!match) {
      return undefined
    }

    return {
      major: Number(match[1]),
      minor: Number(match[2]),
      patch: Number(match[3]),
    }
  }

  static compareVersions(
    current: string,
    latest: string,
  ): number {
    const currentVersion =
      this.parseVersion(current)

    const latestVersion =
      this.parseVersion(latest)

    if (
      !currentVersion ||
      !latestVersion
    ) {
      return 0
    }

    if (
      latestVersion.major !==
      currentVersion.major
    ) {
      return (
        latestVersion.major -
        currentVersion.major
      )
    }

    if (
      latestVersion.minor !==
      currentVersion.minor
    ) {
      return (
        latestVersion.minor -
        currentVersion.minor
      )
    }

    return (
      latestVersion.patch -
      currentVersion.patch
    )
  }

  static isNewerVersion(
    current: string,
    latest: string,
  ): boolean {
    return (
      this.compareVersions(
        current,
        latest,
      ) > 0
    )
  }
}
