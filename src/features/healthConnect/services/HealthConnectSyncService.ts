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
    try {
      const initialized =
        await initialize()

      if (!initialized) {
        console.log(
          '[HealthConnect] Not available',
        )

        return
      }

      console.log(
        '[HealthConnect] Exporting',
        record.id,
      )

      await insertRecords([
        {
          recordType: 'BloodPressure',

          time: record.dateTime,

          systolic: {
            value: record.systolic,
            unit:
              'millimetersOfMercury',
          },

          diastolic: {
            value: record.diastolic,
            unit:
              'millimetersOfMercury',
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
        },
      ])

      console.log(
        '[HealthConnect] Export OK',
        record.id,
      )
    } catch (error) {
      console.error(
        '[HealthConnect] exportBloodPressure failed',
        error,
      )
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
