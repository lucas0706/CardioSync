import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { StatisticsEngine } from '@/domain/statistics/engines/StatisticsEngine'

function record(
  id: string,
  daysAgo: number,
  hour: number,
  systolic: number,
  diastolic: number,
  heartRate?: number,
): BloodPressureRecord {
  const date = new Date()

  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, 0, 0, 0)

  const dateTime = date.toISOString()

  return {
    id,
    dateTime,
    systolic,
    diastolic,
    heartRate,
    arm: 'left',
    position: 'sitting',
    notes: 'STATISTICS AUDIT',
    createdAt: dateTime,
    updatedAt: dateTime,
  }
}

/**
 * Dataset deliberadamente irregular.
 *
 * Día 29:  120/80 + FC
 * Día 28:  130/85 + FC
 * Día 27:  sin medición
 * Día 26:  140/90 sin FC
 * Día 25:  150/95 + FC
 * Día 24:  sin medición
 * Día 23:  125/80 + FC
 * Día 22:  135/85 sin FC
 * Día 21:  sin medición
 * Día 20:  160/100 + FC
 * Día 19:  110/70 + FC
 * Día 18:  sin medición
 * Día 17:  120/75 sin FC
 * Día 16:  sin medición
 * Día 15:  130/80 + FC
 *
 * Esto permite comprobar:
 * - faltantes de FC
 * - días sin mediciones
 * - valores normales/elevados
 * - valores extremos
 * - tendencia
 * - adherencia
 * - promedio
 * - MAP
 * - presión de pulso
 */
const records: BloodPressureRecord[] = [
  record('audit-29', 29, 8, 120, 80, 68),
  record('audit-28', 28, 8, 130, 85, 70),
  record('audit-26', 26, 8, 140, 90),
  record('audit-25', 25, 8, 150, 95, 75),
  record('audit-23', 23, 8, 125, 80, 67),
  record('audit-22', 22, 8, 135, 85),
  record('audit-20', 20, 8, 160, 100, 82),
  record('audit-19', 19, 8, 110, 70, 64),
  record('audit-17', 17, 8, 120, 75),
  record('audit-15', 15, 8, 130, 80, 69),
]

const summary = StatisticsEngine.summarize(
  records,
  {
    period: '30d',
  },
)

console.log(
  '\n========== STATISTICS AUDIT ==========\n',
)

console.log(
  JSON.stringify(
    {
      input: {
        totalRecords: records.length,
        recordsWithHeartRate:
          records.filter(
            record =>
              record.heartRate !== undefined,
          ).length,
        recordsWithoutHeartRate:
          records.filter(
            record =>
              record.heartRate === undefined,
          ).length,
        uniqueMeasurementDays:
          new Set(
            records.map(record =>
              record.dateTime.slice(0, 10),
            ),
          ).size,
      },
      summary,
    },
    null,
    2,
  ),
)

console.log(
  '\n========== END AUDIT ==========\n',
)
