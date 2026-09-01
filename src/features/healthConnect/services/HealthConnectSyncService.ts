import {
  initialize,
  insertRecords,
  BloodPressureBodyPosition,
  BloodPressureMeasurementLocation,
} from 'react-native-health-connect'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

export class HealthConnectSyncService {
  async exportBloodPressure(
    record: BloodPressureRecord,
  ): Promise<void> {
    await this.exportAllBloodPressure([
      record,
    ])
  }

  async exportAllBloodPressure(
    records: BloodPressureRecord[],
  ): Promise<number> {
    try {
      const initialized =
        await initialize()

      if (!initialized) {
        console.log(
          '[HealthConnect] Not available',
        )

        return 0
      }

      if (records.length === 0) {
        return 0
      }

      console.log(
        '[HealthConnect] Exporting batch',
        records.length,
      )

      await insertRecords(
        records.map(record => ({
          recordType:
            'BloodPressure' as const,

          time: new Date(
            record.dateTime,
          ).toISOString(),

          systolic: {
            value: record.systolic,
            unit:
              'millimetersOfMercury' as const,
          },

          diastolic: {
            value: record.diastolic,
            unit:
              'millimetersOfMercury' as const,
          },

          bodyPosition:
            this.mapPosition(
              record.position,
            ),

          measurementLocation:
            this.mapArm(
              record.arm,
            ),

          metadata: {
            clientRecordId:
              record.id,
          },
        })),
      )

      console.log(
        '[HealthConnect] Batch export OK',
        records.length,
      )

      return records.length
    } catch (error) {
      console.error(
        '[HealthConnect] exportAllBloodPressure failed',
        error,
      )

      return 0
    }
  }

  private mapPosition(
    position?: string,
  ): number {
    switch (position) {
      case 'sitting':
        return (
          BloodPressureBodyPosition.SITTING_DOWN
        )

      case 'standing':
        return (
          BloodPressureBodyPosition.STANDING_UP
        )

      case 'lying':
        return (
          BloodPressureBodyPosition.LYING_DOWN
        )

      default:
        return (
          BloodPressureBodyPosition.UNKNOWN
        )
    }
  }

  private mapArm(
    arm?: string,
  ): number {
    switch (arm) {
      case 'left':
        return (
          BloodPressureMeasurementLocation.LEFT_UPPER_ARM
        )

      case 'right':
        return (
          BloodPressureMeasurementLocation.RIGHT_UPPER_ARM
        )

      default:
        return (
          BloodPressureMeasurementLocation.UNKNOWN
        )
    }
  }
}

export const healthConnectSyncService =
  new HealthConnectSyncService()
