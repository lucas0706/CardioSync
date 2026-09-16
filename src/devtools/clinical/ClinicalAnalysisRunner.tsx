import { Text, View } from 'react-native'

import {
  ClinicalTargetSelector,
  ClinicalTargetRepository,
} from '@/domain/clinical/targets'

import { runClinicalHistoricalScenario } from './ClinicalHistoricalScenario'

type TestScenario =
  | 'CKD'
  | 'GENERAL'
  | 'ELDERLY'
  | 'DIABETES'

function getTestScenario(): TestScenario {
  return 'DIABETES'
}

function getClinicalContext(
  scenario: TestScenario,
) {
  switch (scenario) {
    case 'ELDERLY':
      return {
        patientId: 'test-user',
        age: 85,
      }

    case 'GENERAL':
      return {
        patientId: 'test-user',
        age: 60,
      }

    case 'DIABETES':
      return {
        patientId: 'test-user',
        age: 60,
        diabetes: true,
      }

    case 'CKD':
      return {
        patientId: 'test-user',
        age: 60,
        chronicKidneyDisease: true,
      }
  }
}

export default function ClinicalTestScreen() {
  const testScenario =
    getTestScenario()

  const clinicalContext =
    getClinicalContext(
      testScenario,
    )

  const historicalResult =
    runClinicalHistoricalScenario(
      clinicalContext,
    )

  const statistics =
    historicalResult.statistics

  const selectedTarget =
    ClinicalTargetSelector.select(
      clinicalContext,
      'consenso-hta-argentina-2025',
    )

  const allTargets =
    ClinicalTargetRepository.getTargets(
      'consenso-hta-argentina-2025',
    )

  console.log(
    'DEBUG FINDINGS',
    JSON.stringify(
      historicalResult.findings,
      null,
      2,
    ),
  )

  return (
    <View
      style={{
        padding: 40,
      }}
    >
      <Text>
        Clinical Target Debug V2 TEST
      </Text>

      <Text>
        SCENARIO
      </Text>

      <Text>
        {testScenario}
      </Text>

      <Text>
        CONTEXT
      </Text>

      <Text>
        Age: {clinicalContext.age}
      </Text>

      <Text>
        Diabetes:{' '}
        {String(
          clinicalContext.diabetes,
        )}
      </Text>

      <Text>
        Chronic Kidney Disease:{' '}
        {String(
          clinicalContext.chronicKidneyDisease,
        )}
      </Text>

      <Text>
        {' '}
      </Text>

      <Text>
        STATISTICS
      </Text>

      <Text>
        Average systolic:{' '}
        {statistics?.averageSystolic ?? '-'}
      </Text>

      <Text>
        Average diastolic:{' '}
        {statistics?.averageDiastolic ?? '-'}
      </Text>

      <Text>
        {' '}
      </Text>

      <Text>
        ALL TARGETS
      </Text>

      {allTargets.map(
        target => (
          <Text key={target.id}>
            {target.id}
            {' | '}
            {target.conditions?.join(', ')}
          </Text>
        ),
      )}

      <Text>
        {' '}
      </Text>

      <Text>
        SELECTED TARGET
      </Text>

      <Text>
        {selectedTarget?.id ?? 'none'}
      </Text>

      <Text>
        {selectedTarget?.description ?? ''}
      </Text>

      <Text>
        Systolic target:{' '}
        {selectedTarget?.systolic?.min ?? '-'}
        {' - '}
        {selectedTarget?.systolic?.max ?? '-'}
      </Text>

      <Text>
        Diastolic target:{' '}
        {selectedTarget?.diastolic?.min ?? '-'}
        {' - '}
        {selectedTarget?.diastolic?.max ?? '-'}
      </Text>

      <Text>
        {' '}
      </Text>

      <Text>
        FINDINGS:{' '}
        {historicalResult.findings.length}
      </Text>

      {historicalResult.findings.map(
        finding => (
          <Text key={finding.id}>
            {finding.type}
            {' — '}
            {finding.title}
          </Text>
        ),
      )}
    </View>
  )
}
