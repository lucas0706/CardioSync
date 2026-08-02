export const ClinicalTargets = {
  default: {
    systolic: 120,
    diastolic: 80,
  },

  diabetes: {
    systolic: 130,
    diastolic: 80,
  },

  ckd: {
    systolic: 120,
    diastolic: 80,
  },
} as const

export type ClinicalTarget =
  typeof ClinicalTargets.default
