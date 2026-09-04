import type { Arm } from '@/domain/measurements/types/Arm'
import type { Position } from '@/domain/measurements/types/Position'

export type NormalizedImportRecord = {
  dateTime: string
  systolic: number
  diastolic: number
  heartRate?: number
  arm?: Arm
  position?: Position
  notes?: string
}
