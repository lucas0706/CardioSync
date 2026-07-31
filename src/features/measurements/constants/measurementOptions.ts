export const ARM_OPTIONS = [
  {
    label: 'Izquierdo',
    value: 'left',
  },
  {
    label: 'Derecho',
    value: 'right',
  },
] as const

export const POSITION_OPTIONS = [
  {
    label: 'Sentado',
    value: 'sitting',
  },
  {
    label: 'De pie',
    value: 'standing',
  },
  {
    label: 'Acostado',
    value: 'lying',
  },
] as const

export const MEASUREMENT_CONTEXT = [
  'Reposo',
  'Post ejercicio',
  'Estrés',
  'Dolor',
  'Control',
  'Medicación',
] as const
