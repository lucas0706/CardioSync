import { theme } from '@/theme'

export type ClinicalStatus = {
  label: string
  color: string
  bars: number
}

export function getSleepStatus(
  hours: number,
): ClinicalStatus {
  if (hours >= 8) {
    return {
      label: 'Óptimo',
      color: theme.colors.success,
      bars: 8,
    }
  }

  if (hours >= 7) {
    return {
      label: 'Adecuado',
      color: theme.colors.success,
      bars: 6,
    }
  }

  if (hours >= 6) {
    return {
      label: 'Mejorable',
      color: theme.colors.warning,
      bars: 4,
    }
  }

  return {
    label: 'Bajo',
    color: theme.colors.danger,
    bars: 2,
  }
}

export function getStepsStatus(
  steps: number,
): ClinicalStatus {
  if (steps >= 10000) {
    return {
      label: 'Óptimo',
      color: theme.colors.success,
      bars: 8,
    }
  }

  if (steps >= 7500) {
    return {
      label: 'Adecuado',
      color: theme.colors.success,
      bars: 6,
    }
  }

  if (steps >= 5000) {
    return {
      label: 'Mejorable',
      color: theme.colors.warning,
      bars: 4,
    }
  }

  return {
    label: 'Bajo',
    color: theme.colors.danger,
    bars: 2,
  }
}

export function getExerciseStatus(
  minutes: number,
): ClinicalStatus {
  if (minutes >= 45) {
    return {
      label: 'Óptimo',
      color: theme.colors.success,
      bars: 8,
    }
  }

  if (minutes >= 30) {
    return {
      label: 'Adecuado',
      color: theme.colors.success,
      bars: 6,
    }
  }

  if (minutes >= 15) {
    return {
      label: 'Mejorable',
      color: theme.colors.warning,
      bars: 4,
    }
  }

  return {
    label: 'Bajo',
    color: theme.colors.danger,
    bars: 2,
  }
}

export const CLINICAL_REFERENCES = {
  sleep:
    'American Academy of Sleep Medicine (AASM) y Sleep Research Society',

  steps:
    'Paluch et al. The Lancet Public Health (2022)',

  exercise:
    'World Health Organization Physical Activity Guidelines (2020) y European Society of Cardiology Prevention Guidelines',
}
