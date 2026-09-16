export interface GitHubReleaseAsset {
  name: string
  browser_download_url: string
  content_type: string
}

export interface GitHubRelease {
  tag_name: string

  name: string | null

  body: string | null

  draft: boolean

  prerelease: boolean

  assets: GitHubReleaseAsset[]

  html_url: string

  published_at: string | null
}
