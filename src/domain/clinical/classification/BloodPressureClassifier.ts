import type {
  BloodPressureClassificationResult,
  BloodPressureCategory,
} from './BloodPressureClassification'

const CLASSIFICATIONS: Record<
  BloodPressureCategory,
  {
    label: string
    color: string
  }
> = {
  optimal: {
    label: 'Óptima',
    color: '#16A34A',
  },

  normal: {
    label: 'Normal',
    color: '#65A30D',
  },

  'high-normal': {
    label: 'Normal alta',
    color: '#CA8A04',
  },

  'grade-1': {
    label: 'Hipertensión grado 1',
    color: '#EA580C',
  },

  'grade-2': {
    label: 'Hipertensión grado 2',
    color: '#DC2626',
  },

  'grade-3': {
    label: 'Hipertensión grado 3',
    color: '#991B1B',
  },

  'isolated-systolic': {
    label: 'Hipertensión sistólica aislada',
    color: '#7C3AED',
  },
}

function classifyCategory(
  systolic: number,
  diastolic: number,
): BloodPressureCategory {
  /*
   * Severity takes precedence over isolated systolic hypertension.
   *
   * Example:
   * 180/80 -> grade 3, NOT isolated systolic.
   */

  if (systolic >= 180 || diastolic >= 110) {
    return 'grade-3'
  }

  if (systolic >= 160 || diastolic >= 100) {
    return 'grade-2'
  }

  if (systolic >= 140 || diastolic >= 90) {
    return 'grade-1'
  }

  if (systolic >= 140 && diastolic < 90) {
    return 'isolated-systolic'
  }

  if (systolic >= 130 || diastolic >= 85) {
    return 'high-normal'
  }

  if (systolic >= 120 || diastolic >= 80) {
    return 'normal'
  }

  return 'optimal'
}

export class BloodPressureClassifier {
  static classify(
    systolic: number,
    diastolic: number,
  ): BloodPressureClassificationResult {
    const category = classifyCategory(
      systolic,
      diastolic,
    )

    const classification =
      CLASSIFICATIONS[category]

    const safetyWarnings: BloodPressureClassificationResult['safetyWarnings'] =
      []

    if (diastolic < 70) {
      safetyWarnings.push('low-diastolic')
    }

    return {
      category,
      label: classification.label,
      color: classification.color,
      systolic,
      diastolic,
      safetyWarnings,
    }
  }
}
