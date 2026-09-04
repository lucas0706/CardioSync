import {
  readRecords,
} from 'react-native-health-connect'

export async function readAllRecords(
  recordType: any,
  options: any,
): Promise<any[]> {
  let pageToken:
    string | undefined

  const allRecords: any[] = []

  do {
    const result =
      await readRecords(
        recordType,
        {
          ...options,
          pageToken,
          pageSize: 5000,
        },
      )

    allRecords.push(
      ...result.records,
    )

    pageToken =
      result.pageToken
  } while (pageToken)

  return allRecords
}
