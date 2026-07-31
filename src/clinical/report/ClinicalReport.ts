import { ClinicalAlert } from '../alerts/ClinicalAlert'
import { ClinicalAnalysis } from '../models/ClinicalAnalysis'
import { CardiovascularRisk } from '../risk/CardiovascularRisk'
import { TrendAnalysis } from '../trends/TrendAnalysis'

export interface ClinicalReport {
  analysis: ClinicalAnalysis

  trends?: TrendAnalysis

  risk?: CardiovascularRisk

  alerts: ClinicalAlert[]
}
