import type {
  GitHubRelease,
} from '../models/GitHubRelease'

const GITHUB_LATEST_RELEASE_URL =
  'https://api.github.com/repos/lucas0706/CardioSync/releases/latest'

export class GitHubReleaseService {
  static async getLatestRelease():
    Promise<
      GitHubRelease | undefined
    > {
    try {
      const response =
        await fetch(
          GITHUB_LATEST_RELEASE_URL,
          {
            headers: {
              Accept:
                'application/vnd.github+json',
            },
          },
        )

      if (!response.ok) {
        return undefined
      }

      const data =
        (await response.json()) as GitHubRelease

      if (
        data.draft ||
        data.prerelease
      ) {
        return undefined
      }

      return data
    } catch {
      return undefined
    }
  }
}
