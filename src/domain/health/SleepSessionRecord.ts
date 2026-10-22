export interface SleepInterval {
  startTime: string
  endTime: string
}

export interface SleepSessionRecord {
  startTime: string
  endTime: string
  durationMinutes: number
  sleepIntervals: SleepInterval[]
  title?: string
}
