import { ClinicalChartDataPoint } from '../types/ClinicalChartData'

export function getClinicalChartExportData(
  data: ClinicalChartDataPoint[],
) {
  return data.map(item => ({
    date: item.date,
    systolic: item.systolic,
    diastolic: item.diastolic,
    heartRate: item.heartRate,
    weight: item.weight,
    glucose: item.glucose,
    spo2: item.spo2,
    temperature: item.temperature,
    respiratoryRate:
      item.respiratoryRate,
  }))
}
