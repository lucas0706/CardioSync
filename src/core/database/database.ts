import * as SQLite from 'expo-sqlite'

const DATABASE_NAME = 'cardiosync.db'

export let database =
  SQLite.openDatabaseSync(DATABASE_NAME)

export function reopenDatabase(): void {
  database =
    SQLite.openDatabaseSync(DATABASE_NAME)
}
