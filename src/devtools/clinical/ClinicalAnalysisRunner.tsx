import { Text, View } from 'react-native'

import {
  ClinicalTargetSelector,
  ClinicalTargetRepository,
} from '@/domain/clinical/targets'

import { runClinicalHistoricalScenario } from './ClinicalHistoricalScenario'


const historicalResult = runClinicalHistoricalScenario()

const statistics = historicalResult.statistics

type TestScenario =
  | 'CKD'
  | 'GENERAL'
  | 'ELDERLY'
  | 'DIABETES'


function getTestScenario(): TestScenario {
  return 'DIABETES'
}


const TEST_SCENARIO =
  getTestScenario()


const clinicalContext =
  TEST_SCENARIO === 'ELDERLY'
    ? {
        patientId: 'test-user',
        age: 85,
      }
    : TEST_SCENARIO === 'GENERAL'
      ? {
          patientId: 'test-user',
          age: 60,
        }
      : TEST_SCENARIO === 'DIABETES'
        ? {
            patientId: 'test-user',
            age: 60,
            diabetes: true,
          }
        : {
            patientId: 'test-user',
            age: 60,
            chronicKidneyDisease: true,
          }


export default function ClinicalTestScreen() {

  const selectedTarget =
    ClinicalTargetSelector.select(
      clinicalContext,
      'consenso-hta-argentina-2025',
    )


  const allTargets =
    ClinicalTargetRepository.getTargets(
      'consenso-hta-argentina-2025',
    )


  const result =
    historicalResult





    console.log(
      'DEBUG FINDINGS',
      JSON.stringify(
        result.findings,
        null,
        2,
      ),
    )

  return (

    <View style={{ padding: 40 }}>

      <Text>
        Clinical Target Debug V2 TEST
      </Text>


      <Text>
        CONTEXT
      </Text>

      <Text>
        Age: {clinicalContext.age}
      </Text>

      <Text>
        Chronic Kidney Disease: {String(
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
        Average systolic: {statistics?.averageSystolic ?? '-'}
      </Text>

      <Text>
        Average diastolic: {statistics?.averageDiastolic ?? '-'}
      </Text>


      <Text>
        {' '}
      </Text>


      <Text>
        ALL TARGETS
      </Text>

      {
        allTargets.map(
          (target: import('@/domain/clinical/targets').ClinicalTarget) => (
            <Text key={target.id}>
              {target.id}
              {' | '}
              {target.conditions?.join(',')}
            </Text>
          ),
        )
      }


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
        Systolic target:
        {' '}
        {selectedTarget?.systolic?.min ?? '-'}
        {' '}
        -
        {' '}
        {selectedTarget?.systolic?.max ?? '-'}
      </Text>


      <Text>
        Diastolic target:
        {' '}
        {selectedTarget?.diastolic?.min ?? '-'}
        {' '}
        -
        {' '}
        {selectedTarget?.diastolic?.max ?? '-'}
      </Text>


      <Text>
        {' '}
      </Text>


      <Text>
        FINDINGS: {result.findings.length}
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
