import type { SleepSessionRecord, SleepInterval } from '@/domain/health/SleepSessionRecord'
import { sumNonOverlappingIntervalMinutes } from '@/domain/health/HealthMetrics'

function isAsleepStage(stage: unknown): boolean {
  // Health Connect SleepStageType: SLEEPING=2, LIGHT=4, DEEP=5, REM=6.
  return typeof stage === 'number' && [2, 4, 5, 6].includes(stage)
}

function isValidInterval(startTime: unknown, endTime: unknown): boolean {
  return (
    typeof startTime === 'string' &&
    typeof endTime === 'string' &&
    Number.isFinite(Date.parse(startTime)) &&
    Number.isFinite(Date.parse(endTime)) &&
    Date.parse(endTime) > Date.parse(startTime)
  )
}

export class SleepMapper {
  static toDomain(record: any): SleepSessionRecord {
    const startTime = typeof record?.startTime === 'string' ? record.startTime : ''
    const endTime = typeof record?.endTime === 'string' ? record.endTime : ''
    const hasStages = Array.isArray(record?.stages) && record.stages.length > 0

    const sleepIntervals: SleepInterval[] = hasStages
      ? record.stages.flatMap((stage: any): SleepInterval[] => {
          if (
            !isAsleepStage(stage?.stage) ||
            !isValidInterval(stage?.startTime, stage?.endTime)
          ) {
            return []
          }

          return [{
            startTime: stage.startTime,
            endTime: stage.endTime,
          }]
        })
      : isValidInterval(startTime, endTime)
        ? [{ startTime, endTime }]
        : []

    const durationMinutes = sumNonOverlappingIntervalMinutes(sleepIntervals)

    return {
      startTime,
      endTime,
      durationMinutes,
      sleepIntervals,
      title: typeof record?.title === 'string' ? record.title : undefined,
    }
  }
}
