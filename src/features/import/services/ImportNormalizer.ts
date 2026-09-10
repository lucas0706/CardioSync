import { z } from 'zod'

import type { Arm } from '@/domain/measurements/types/Arm'
import type { Position } from '@/domain/measurements/types/Position'
import type { NormalizedImportRecord } from '../types/NormalizedImportRecord'

const normalizedImportSchema = z.object({
  dateTime: z.string().min(1),
  systolic: z.number().min(40).max(300),
  diastolic: z.number().min(20).max(200),
  heartRate: z.number().min(20).max(250).optional(),
  arm: z.enum(['left', 'right']).optional(),
  position: z.enum(['sitting', 'standing', 'lying']).optional(),
  notes: z.string().optional(),
})

export type RawImportRecord = {
  dateTime: string
  systolic: number
  diastolic: number
  heartRate?: number | null
  arm?: string | null
  position?: string | null
  notes?: string | null
}

export type NormalizationResult =
  | {
      success: true
      record: NormalizedImportRecord
    }
  | {
      success: false
      error: string
    }

function normalizeText(value?: string | null): string | undefined {
  const normalized = value?.trim()

  return normalized ? normalized : undefined
}

function normalizeImportedDateTime(value: string): string {
  const normalized = value.trim()

  const separatorIndex = normalized.indexOf(' ')

  if (separatorIndex === -1) {
    throw new Error(`Formato de fecha no reconocido: ${value}`)
  }

  const date = normalized.slice(0, separatorIndex)
  const time = normalized.slice(separatorIndex + 1)

  const dateParts = date.split('-')
  const timeParts = time.split(':')

  if (
    dateParts.length !== 3 ||
    timeParts.length < 2 ||
    timeParts.length > 3
  ) {
    throw new Error(`Formato de fecha no reconocido: ${value}`)
  }

  const [year, month, day] = dateParts
  const [hour, minute, second = '00'] = timeParts

  if (
    year.length !== 4 ||
    month.length !== 2 ||
    day.length !== 2 ||
    hour.length !== 2 ||
    minute.length !== 2 ||
    second.length !== 2 ||
    !Number.isInteger(Number(year)) ||
    !Number.isInteger(Number(month)) ||
    !Number.isInteger(Number(day)) ||
    !Number.isInteger(Number(hour)) ||
    !Number.isInteger(Number(minute)) ||
    !Number.isInteger(Number(second))
  ) {
    throw new Error(`Formato de fecha no reconocido: ${value}`)
  }

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000`
}

function normalizeHeartRate(
  value?: number | null,
): number | undefined {
  if (value == null || value === 0) {
    return undefined
  }

  return value
}

function normalizeArm(
  value?: string | null,
): { value?: Arm; error?: string } {
  const normalized = normalizeText(value)?.toLowerCase()

  if (!normalized) {
    return {}
  }

  if (
    normalized === 'left' ||
    normalized === 'brazo izquierdo' ||
    normalized === 'izquierdo'
  ) {
    return { value: 'left' }
  }

  if (
    normalized === 'right' ||
    normalized === 'brazo derecho' ||
    normalized === 'derecho'
  ) {
    return { value: 'right' }
  }

  return {
    error: `Valor de brazo no reconocido: ${value}`,
  }
}

function normalizePosition(
  value?: string | null,
): { value?: Position; error?: string } {
  const normalized = normalizeText(value)?.toLowerCase()

  if (!normalized) {
    return {}
  }

  if (
    normalized === 'sitting' ||
    normalized === 'sentado'
  ) {
    return { value: 'sitting' }
  }

  if (
    normalized === 'standing' ||
    normalized === 'de pie'
  ) {
    return { value: 'standing' }
  }

  if (
    normalized === 'lying' ||
    normalized === 'acostado'
  ) {
    return { value: 'lying' }
  }

  return {
    error: `Valor de posición no reconocido: ${value}`,
  }
}

export function normalizeImportRecord(
  raw: RawImportRecord,
): NormalizationResult {
  const arm = normalizeArm(raw.arm)

  if (arm.error) {
    return {
      success: false,
      error: arm.error,
    }
  }

  const position = normalizePosition(raw.position)

  if (position.error) {
    return {
      success: false,
      error: position.error,
    }
  }

  let normalizedDateTime: string

  try {
    normalizedDateTime = normalizeImportedDateTime(raw.dateTime)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'Formato de fecha no reconocido.',
    }
  }

  const normalized = {
    dateTime: normalizedDateTime,
    systolic: raw.systolic,
    diastolic: raw.diastolic,
    heartRate: normalizeHeartRate(raw.heartRate),
    arm: arm.value,
    position: position.value,
    notes: normalizeText(raw.notes),
  }

  const result = normalizedImportSchema.safeParse(normalized)

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues
        .map((issue) => issue.message)
        .join('; '),
    }
  }

  return {
    success: true,
    record: result.data,
  }
}
