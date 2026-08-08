import { Text, View } from 'react-native'

import { ClinicalAnalysisDomainService } from '@/domain/clinical/services/ClinicalAnalysisDomainService'

import type { StatisticsSummary } from '@/domain/statistics/models/StatisticsSummary'


const statistics: StatisticsSummary = {
  totalMeasurements: 30,

  averageSystolic: 145,
  averageDiastolic: 75,

  maximumSystolic: 150,
  maximumDiastolic: 80,

  minimumSystolic: 140,
  minimumDiastolic: 70,

  pulsePressureAverage: 70,

  meanArterialPressureAverage: 91,

  systolicStandardDeviation: 5,
  diastolicStandardDeviation: 3,

  systolicVariability: 5,
  diastolicVariability: 3,

  hypertensionLoad: 0,

  timeInTarget: 100,

  adherence: 100,

  trend: 'stable',
}


export default function ClinicalTestScreen() {

  const service =
    new ClinicalAnalysisDomainService()


  const result =
    service.analyze({
      measurements: [],

      statistics,

      context: {
        patientId: 'test-user',
        age: 85,
      },
    })


  return (
    <View style={{ padding: 40 }}>

      <Text>
        Clinical Target Selector Age Test
      </Text>

      <Text>
        Findings: {result.findings.length}
      </Text>

      {
        result.findings.map(
          (finding) => (
            <Text key={finding.id}>
              {finding.title}
            </Text>
          ),
        )
      }

    </View>
  )
}
