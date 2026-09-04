import type {
  ReportHealthContext,
} from '../models/ReportHealthContext'

import {
  getHealthConnectSettings,
  healthSummaryBuilder,
} from '@/features/healthConnect'

export class ReportHealthContextBuilder {
  async build():
    Promise<
      ReportHealthContext | undefined
    > {
    const settings =
      getHealthConnectSettings()

    if (!settings.enabled) {
      console.log(
        '[REPORT HC] disabled',
      )

      return undefined
    }

    try {
      const summary =
        await healthSummaryBuilder.build()

      console.log(
        '[REPORT HC] summary',
        summary,
      )

      return {
        averageDailySteps30Days:
          summary.averageDailySteps30Days,

        averageHeartRate30Days:
          summary.averageHeartRate30Days,

        averageSleepHours30Days:
          summary.averageSleepHours30Days,

        exerciseMinutes30Days:
          summary.exerciseMinutes30Days,

        latestWeightKg:
          summary.latestWeightKg,
      }
    } catch (error) {
      console.error(
        '[REPORT HC ERROR]',
        error,
      )

      return undefined
    }
  }
}

export const
  reportHealthContextBuilder =
    new ReportHealthContextBuilder()
