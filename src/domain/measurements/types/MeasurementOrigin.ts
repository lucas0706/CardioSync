/**
 * Origin of a blood pressure record inside CardioSync.
 *
 * This describes data provenance,
 * not clinical measurement method.
 */

export type MeasurementOrigin =
  | 'manual'
  | 'csv-import'
  | 'excel-import'
  | 'database-import'
  | 'external-app'
