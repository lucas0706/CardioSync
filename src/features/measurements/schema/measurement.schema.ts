import { z } from 'zod'

export const measurementSchema = z.object({
  systolic: z.number().min(40).max(300),

  diastolic: z.number().min(20).max(200),

  heartRate: z.number().min(20).max(250).optional(),

  notes: z.string().optional(),

  arm: z
    .enum(['left', 'right'])
    .optional()
    .nullable(),

  position: z
    .enum(['sitting', 'standing', 'lying'])
    .optional()
    .nullable(),
})

export type MeasurementFormData =
  z.infer<typeof measurementSchema>
