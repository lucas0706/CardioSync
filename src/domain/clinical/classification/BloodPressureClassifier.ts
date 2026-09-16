import type {
  BloodPressureClassificationResult,
  BloodPressureCategory,
  BloodPressureClassification,
} from './BloodPressureClassification'

const CLASSIFICATIONS: Record<
  BloodPressureCategory,
  {
    label: string
    color: string
  }
> = {
  normal: {
    label: 'Presión arterial normal',
    color: '#16A34A',
  },

  borderline: {
    label: 'Presión arterial limítrofe',
    color: '#CA8A04',
  },

  'grade-1': {
    label: 'Hipertensión arterial nivel 1',
    color: '#EA580C',
  },

  'grade-2': {
    label: 'Hipertensión arterial nivel 2',
    color: '#DC2626',
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
   * Consenso Argentino de Hipertensión Arterial 2025.
   *
   * Clasificación de presión arterial en consultorio
   * para individuos de 16 años o más.
   *
   * La categoría se determina por el valor más alto
   * entre presión sistólica y diastólica.
   *
   * La hipertensión sistólica aislada se evalúa antes
   * de HTA nivel 1 porque PAS >=140 con PAD <90
   * constituye un fenotipo específico.
   */

  if (systolic >= 140 && diastolic < 90) {
    return 'isolated-systolic'
  }

  if (
    systolic >= 160 ||
    diastolic >= 100
  ) {
    return 'grade-2'
  }

  if (
    systolic >= 140 ||
    diastolic >= 90
  ) {
    return 'grade-1'
  }

  if (
    systolic >= 130 ||
    diastolic >= 80
  ) {
    return 'borderline'
  }

  return 'normal'
}

export class BloodPressureClassifier {
  static getClassification(
    category: BloodPressureCategory,
  ): BloodPressureClassification {
    const classification =
      CLASSIFICATIONS[category]

    return {
      category,
      label: classification.label,
      color: classification.color,
    }
  }

  static classify(
    systolic: number,
    diastolic: number,
  ): BloodPressureClassificationResult {
    const category =
      classifyCategory(
        systolic,
        diastolic,
      )

    const classification =
      this.getClassification(category)

    const safetyWarnings:
      BloodPressureClassificationResult[
        'safetyWarnings'
      ] = []

    if (diastolic < 70) {
      safetyWarnings.push(
        'low-diastolic',
      )
    }

    return {
      ...classification,
      systolic,
      diastolic,
      safetyWarnings,
    }
  }
}
