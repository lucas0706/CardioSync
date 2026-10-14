import type { GitHubRelease } from '../models/GitHubRelease'

const GITHUB_LATEST_RELEASE_URL =
  'https://api.github.com/repos/lucas0706/CardioSync/releases/latest'

export class GitHubReleaseService {
  static async getLatestRelease(): Promise<GitHubRelease | undefined> {
    try {
      const response = await fetch(GITHUB_LATEST_RELEASE_URL, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      })

      if (!response.ok) {
        throw new Error(`GitHub respondió con estado ${response.status}.`)
      }

      const data: unknown = await response.json()

      if (!isGitHubRelease(data)) {
        throw new Error('La respuesta de GitHub Releases no tiene un formato válido.')
      }

      if (data.draft || data.prerelease) {
        return undefined
      }

      return data
    } catch (error) {
      throw new Error('No se pudo consultar GitHub Releases.', {
        cause: error,
      })
    }
  }
}

function isGitHubRelease(value: unknown): value is GitHubRelease {
  if (!value || typeof value !== 'object') {
    return false
  }

  const release = value as Partial<GitHubRelease>

  return (
    typeof release.tag_name === 'string' &&
    typeof release.html_url === 'string' &&
    typeof release.draft === 'boolean' &&
    typeof release.prerelease === 'boolean' &&
    Array.isArray(release.assets) &&
    release.assets.every((asset: unknown) => {
      if (!asset || typeof asset !== 'object') {
        return false
      }

      const candidate = asset as Partial<GitHubRelease['assets'][number]>
      return (
        typeof candidate.id === 'number' &&
        typeof candidate.name === 'string' &&
        typeof candidate.browser_download_url === 'string' &&
        typeof candidate.content_type === 'string' &&
        typeof candidate.size === 'number' &&
        (candidate.digest === undefined ||
          candidate.digest === null ||
          typeof candidate.digest === 'string')
      )
    })
  )
}
