export const ARMS = ['left', 'right'] as const

export type Arm = (typeof ARMS)[number]
