export interface ReportHealthContext {
  averageHeartRate30Days: number

  averageDailySteps30Days: number

  averageSleepHours30Days: number

  exerciseMinutes30Days: number

  latestWeightKg?: number

  latestWeightDate?: string
}
