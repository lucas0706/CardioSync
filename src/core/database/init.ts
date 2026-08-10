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
  `)

  try {
    database.execSync(
      `ALTER TABLE clinical_profile ADD COLUMN name TEXT`,
    )
  } catch {
    // La columna ya existe.
  }
}
