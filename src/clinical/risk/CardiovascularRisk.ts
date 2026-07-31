export interface CardiovascularRisk {
  score?: number

  category:
    | 'low'
    | 'moderate'
    | 'high'
    | 'very-high'

  recommendation: string
}
