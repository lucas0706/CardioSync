export const POSITIONS = [
  'sitting',
  'standing',
  'lying',
] as const

export type Position = (typeof POSITIONS)[number]
