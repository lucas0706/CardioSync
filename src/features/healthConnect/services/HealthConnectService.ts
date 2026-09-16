import {
  initialize,
  requestPermission,
} from 'react-native-health-connect'

export class HealthConnectService {
  private initialized = false

  async initialize(): Promise<boolean> {
    try {
      this.initialized =
        await initialize()

      return this.initialized
    } catch (error) {
      console.error(
        '[HealthConnect] initialize failed',
        error,
      )

      this.initialized = false

      return false
    }
  }

  isInitialized(): boolean {
    return this.initialized
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const result =
        await requestPermission([
          {
            accessType: 'read',
            recordType: 'BloodPressure',
          },
          {
            accessType: 'write',
            recordType: 'BloodPressure',
          },
          {
            accessType: 'read',
            recordType: 'HeartRate',
          },
          {
            accessType: 'read',
            recordType: 'Steps',
          },
          {
            accessType: 'read',
            recordType: 'SleepSession',
          },
          {
            accessType: 'read',
            recordType: 'ExerciseSession',
          },
          {
            accessType: 'read',
            recordType: 'Weight',
          },
          {
            accessType: 'write',
            recordType: 'Weight',
          },
          {
            accessType: 'read',
            recordType: 'OxygenSaturation',
          },
          {
            accessType: 'write',
            recordType: 'OxygenSaturation',
          },
        ])

      console.log(
        '[HealthConnect] permissions result',
        result,
      )

      return true
    } catch (error) {
      console.error(
        '[HealthConnect] permissions failed',
        error,
      )

      return false
    }
  }
}

export const healthConnectService =
  new HealthConnectService()
