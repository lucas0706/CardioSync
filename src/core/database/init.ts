import { database } from './database'

export function initializeDatabase() {
  database.execSync(`
    CREATE TABLE IF NOT EXISTS blood_pressure_records (
      id TEXT PRIMARY KEY NOT NULL,

      dateTime TEXT NOT NULL,

      systolic INTEGER NOT NULL,

      diastolic INTEGER NOT NULL,

      heartRate INTEGER,

      weight REAL,
      height REAL,
      bmi REAL,

      glucose REAL,
      spo2 REAL,
      temperature REAL,
      respiratoryRate INTEGER,

      pain INTEGER,

      arm TEXT,
      position TEXT,

      notes TEXT,

      guideline TEXT,

      createdAt TEXT NOT NULL,

      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS backup_settings (
      id INTEGER PRIMARY KEY NOT NULL,

      enabled INTEGER NOT NULL DEFAULT 0,

      frequency TEXT NOT NULL DEFAULT 'daily',

      weekday INTEGER NOT NULL DEFAULT 1,

      time1 TEXT,

      time2 TEXT,

      time3 TEXT,

      lastRunAt TEXT,

      lastStatus TEXT,

      lastError TEXT,

      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clinical_profile (
      patientId TEXT PRIMARY KEY NOT NULL,
      name TEXT,

      age INTEGER,
      sex TEXT,

      height REAL,
      weight REAL,
      bmi REAL,

      smoking INTEGER,
      diabetes INTEGER,
      dyslipidemia INTEGER,
      obesity INTEGER,
      familyHistoryCardiovascularDisease INTEGER,

      cardiovascularDisease INTEGER,
      heartFailure INTEGER,
      strokeHistory INTEGER,
      peripheralVascularDisease INTEGER,

      chronicKidneyDisease INTEGER,

      pregnancy INTEGER,
      olderAdult INTEGER,

      physicalActivityLevel TEXT,
      alcoholConsumption TEXT,
      dietaryPattern TEXT,

      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS health_connect_settings (
      id INTEGER PRIMARY KEY NOT NULL,

      enabled INTEGER NOT NULL DEFAULT 0,

      connectedAt TEXT,

      updatedAt TEXT NOT NULL
    );
  `)

  try {
    database.execSync(
      `ALTER TABLE clinical_profile ADD COLUMN name TEXT`,
    )
  } catch {
    // La columna ya existe.
  }

  const backupColumns =
    database.getAllSync<{
      name: string
    }>(
      `PRAGMA table_info(backup_settings)`,
    )

  const hasColumn = (name: string): boolean =>
    backupColumns.some(
      (column) => column.name === name,
    )

  if (!hasColumn('weekday')) {
    database.execSync(`
      ALTER TABLE backup_settings
      ADD COLUMN weekday INTEGER NOT NULL DEFAULT 1
    `)
  }

  if (!hasColumn('time1')) {
    database.execSync(`
      ALTER TABLE backup_settings
      ADD COLUMN time1 TEXT
    `)
  }

  if (!hasColumn('time2')) {
    database.execSync(`
      ALTER TABLE backup_settings
      ADD COLUMN time2 TEXT
    `)
  }

  if (!hasColumn('time3')) {
    database.execSync(`
      ALTER TABLE backup_settings
      ADD COLUMN time3 TEXT
    `)
  }

  const legacyTimeColumn =
    hasColumn('time')

  if (legacyTimeColumn) {
    database.execSync(`
      UPDATE backup_settings
      SET time1 = time
      WHERE
        (time1 IS NULL OR time1 = '')
        AND time IS NOT NULL
        AND time != ''
    `)
  }

  const healthConnectColumns =
    database.getAllSync<{
      name: string
    }>(
      `PRAGMA table_info(health_connect_settings)`,
    )

  const hasHealthColumn = (
    name: string,
  ): boolean =>
    healthConnectColumns.some(
      (column) => column.name === name,
    )

  if (!hasHealthColumn('connectedAt')) {
    database.execSync(`
      ALTER TABLE health_connect_settings
      ADD COLUMN connectedAt TEXT
    `)
  }

  if (!hasHealthColumn('updatedAt')) {
    database.execSync(`
      ALTER TABLE health_connect_settings
      ADD COLUMN updatedAt TEXT
    `)

    database.execSync(`
      UPDATE health_connect_settings
      SET updatedAt = CURRENT_TIMESTAMP
      WHERE updatedAt IS NULL
    `)
  }
}
