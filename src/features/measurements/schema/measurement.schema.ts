import { z } from 'zod'

export const measurementSchema = z.object({
  systolic: z
    .number()
    .min(40)
    .max(300),

  diastolic: z
    .number()
    .min(20)
    .max(200),

  heartRate: z
    .number()
    .min(20)
    .max(250)
    .optional(),

  weight: z
    .number()
    .min(20)
    .max(400)
    .optional(),

  notes: z.string().optional(),
})

export type MeasurementFormData =
  z.infer<typeof measurementSchema>
