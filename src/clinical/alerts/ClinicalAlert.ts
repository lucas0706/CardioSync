export interface ClinicalAlert {
  id: string

  title: string

  description: string

  severity: 'low' | 'medium' | 'high' | 'critical'

  action: string
}
