export interface AppVersionInfo {
  version: string
  releaseDate: string
  build: string
  status: string
}

export interface AppChangeLogItem {
  id: string
  title: string
}

export interface AppTechnicalInfo {
  expoSdk: string
  reactNative: string
  platform: string
  database: string
}
