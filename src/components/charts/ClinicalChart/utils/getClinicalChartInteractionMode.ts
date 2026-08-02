export type ClinicalInteractionMode =
  | 'touch'
  | 'pan'
  | 'zoom'

export function getClinicalChartInteractionMode(
  hasManyPoints: boolean,
): ClinicalInteractionMode[] {

  if (hasManyPoints) {
    return [
      'touch',
      'pan',
      'zoom',
    ]
  }

  return [
    'touch',
    'zoom',
  ]
}
