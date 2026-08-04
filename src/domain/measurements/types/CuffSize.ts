export const CUFF_SIZES = [
  'small',
  'medium',
  'large',
] as const

export type CuffSize = (typeof CUFF_SIZES)[number]
