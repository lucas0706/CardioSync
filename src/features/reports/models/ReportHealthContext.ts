export interface ReportHealthTrendPoint {
  date: string
  value: number | null
}

export interface ReportHealthContext {
  averageHeartRate30Days: number

  averageDailySteps30Days: number

  averageSleepHours30Days: number

  exerciseMinutes30Days: number

  averageDailyExerciseMinutes30Days: number

  dailySteps30Days: ReportHealthTrendPoint[]

  dailyHeartRate30Days: ReportHealthTrendPoint[]

  dailySleepHours30Days: ReportHealthTrendPoint[]

  dailyExerciseMinutes30Days: ReportHealthTrendPoint[]
}
