import { ClinicalSeriesKey } from '../types/ClinicalSeries'

export function getClinicalAxisLabel(
  key: ClinicalSeriesKey,
): string {

  switch (key) {

    case 'systolic':
    case 'diastolic':
      return 'Presión arterial (mmHg)'

    case 'heartRate':
      return 'Frecuencia cardíaca (lpm)'

    case 'weight':
      return 'Peso (kg)'

    case 'glucose':
      return 'Glucosa (mg/dL)'

    case 'spo2':
      return 'SpO₂ (%)'

    case 'temperature':
      return 'Temperatura (°C)'

    case 'respiratoryRate':
      return 'Frecuencia respiratoria (rpm)'

    default:
      return ''
  }
}
