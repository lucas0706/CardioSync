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

      device TEXT,


      context TEXT,

      symptoms TEXT,

      medicationTaken INTEGER,

      medicationName TEXT,

      notes TEXT,

      guideline TEXT,

      createdAt TEXT NOT NULL,

      updatedAt TEXT NOT NULL

    );
  `)
}
