import {
  readRecords,
} from 'react-native-health-connect'

export async function testAggregate() {
  const endTime =
    new Date()

  const startTime =
    new Date()

  startTime.setFullYear(
    startTime.getFullYear() - 2,
  )

  const result =
    await readRecords(
      'Weight',
      {
        timeRangeFilter: {
          operator: 'between',
          startTime:
            startTime.toISOString(),
          endTime:
            endTime.toISOString(),
        },
      },
    )

  console.log(
    '[HC WEIGHT COUNT]',
    result.records.length,
  )

  console.log(
    '[HC WEIGHT FIRST]',
    JSON.stringify(
      result.records[0],
      null,
      2,
    ),
  )
}
