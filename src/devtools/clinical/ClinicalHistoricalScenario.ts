import { StatisticsDomainService } from '@/domain/statistics'
import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { ClinicalAnalysisDomainService } from '@/domain/clinical/services/ClinicalAnalysisDomainService'

function createHistoricalRecords(): BloodPressureRecord[] {

  const values = [
    [128, 78],
    [130, 80],
    [132, 81],
    [135, 82],
    [138, 85],
    [140, 86],
    [142, 88],
    [145, 90],
    [138, 84],
    [136, 82],
    [134, 81],
    [132, 80],
    [130, 79],
    [129, 78],
    [131, 80],
    [133, 82],
    [135, 83],
    [137, 85],
    [140, 87],
    [142, 89],
    [144, 90],
    [139, 86],
    [136, 84],
    [134, 82],
    [132, 80],
    [130, 78],
    [128, 77],
    [131, 79],
    [133, 81],
    [135, 83],
  ]


  return values.map(
    ([systolic, diastolic], index) => {

      const date =
        new Date()

      date.setDate(
        date.getDate() - (30 - index),
      )

      return {
        id:
          `test-${index}`,

        dateTime:
          date.toISOString(),

        createdAt:
          date.toISOString(),

        updatedAt:
          date.toISOString(),

        systolic,

        diastolic,

        origin:
          'manual',
      }
    },
  )
}


export function runClinicalHistoricalScenario() {

  const records =
    createHistoricalRecords()


  const statistics =
    StatisticsDomainService.getSummary(
      records,
    )


  const service =
    new ClinicalAnalysisDomainService()


  const result =
    service.analyze({
      measurements: records,

      statistics,

      context: {
        patientId: 'test-patient',
        age: 55,
      },
    })


  console.log(
    'HISTORICAL STATISTICS',
    JSON.stringify(
      statistics,
      null,
      2,
    ),
  )


  console.log(
    'HISTORICAL FINDINGS',
    JSON.stringify(
      result.findings,
      null,
      2,
    ),
  )

  console.log(
    'HISTORICAL STRUCTURED RESULT',
    JSON.stringify(
      result.result,
      null,
      2,
    ),
  )

  return result
}
