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
      console.log(
        '[UPDATE] Request:',
        GITHUB_LATEST_RELEASE_URL,
      )

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

      console.log(
        '[UPDATE] Status:',
        response.status,
      )

      const text =
        await response.text()

      console.log(
        '[UPDATE] Body:',
        text,
      )

      if (!response.ok) {
        return undefined
      }

      const data =
        JSON.parse(
          text,
        ) as GitHubRelease

      if (
        data.draft ||
        data.prerelease
      ) {
        return undefined
      }

      return data
    } catch (error) {
      console.log(
        '[UPDATE] ERROR:',
        error,
      )

      return undefined
    }
  }
}
