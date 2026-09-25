import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export function getClinicalTooltipSymbol(
  key: ClinicalSeriesKey,
): string {

  switch (key) {

    case 'systolic':
      return '□'

    case 'diastolic':
      return '○'

    case 'heartRate':
      return '△'

    case 'weight':
      return '◇'

    case 'glucose':
      return '●'

    case 'spo2':
      return '◆'

    case 'temperature':
      return '▲'

    case 'respiratoryRate':
      return '■'

    default:
      return '•'
  }
}
