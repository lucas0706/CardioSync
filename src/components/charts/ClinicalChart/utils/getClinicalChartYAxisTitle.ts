import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export function getClinicalChartYAxisTitle(
  key?: ClinicalSeriesKey,
): string {

  switch (key) {

    case 'systolic':
    case 'diastolic':
      return 'mmHg'

    case 'heartRate':
      return 'lpm'

    case 'weight':
      return 'kg'

    case 'glucose':
      return 'mg/dL'

    case 'spo2':
      return '%'

    case 'temperature':
      return '°C'

    case 'respiratoryRate':
      return 'rpm'

    default:
      return ''
  }
}
