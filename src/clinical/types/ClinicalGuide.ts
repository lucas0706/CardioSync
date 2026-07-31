export type ClinicalGuideId =
  | 'cardiosync'
  | 'esc2024'
  | 'esh2023'
  | 'accaha2017'
  | 'ish2020'
  | 'kdigo2024'
  | 'ada2025'
  | 'isshp'
  | 'pediatric'

export interface ClinicalGuide {
  id: ClinicalGuideId
  name: string
  version: string
  enabled: boolean
}
