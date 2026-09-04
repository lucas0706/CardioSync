export interface HealthSummary {
  todayHeartRateAverage: number

  todaySteps: number

  averageSleepHours: number

  exerciseMinutesToday: number

  latestWeightKg?: number

  latestWeightDate?: string

  averageHeartRate30Days: number

  averageDailySteps30Days: number

  averageSleepHours30Days: number

  exerciseMinutes30Days: number
}
