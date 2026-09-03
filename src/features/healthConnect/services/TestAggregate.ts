import {
  aggregateRecord,
} from 'react-native-health-connect'

export async function testAggregate() {
  const endTime = new Date()

  const startTime = new Date()

  startTime.setHours(
    0,
    0,
    0,
    0,
  )

  const result =
    await aggregateRecord({
      recordType: 'Steps',
      timeRangeFilter: {
        operator: 'between',
        startTime:
          startTime.toISOString(),
        endTime:
          endTime.toISOString(),
      },
    })

  console.log(
    '[HC AGGREGATE STEPS]',
    result,
  )
}
