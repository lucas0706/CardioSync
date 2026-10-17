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
): {
  category: BloodPressureCategory
  systolicDetermines: boolean
  diastolicDetermines: boolean
} {
  /*
   * Umbrales de clasificación configurados en CardioSync.
   * La validación bibliográfica completa debe contrastarse
   * con la publicación original del consenso.
   *
   * Se evalúa nivel 2 antes que sistólica aislada para que
   * una elevación de nivel 2 no quede oculta por esa categoría.
   */

  if (systolic >= 160 || diastolic >= 100) {
    return {
      category: 'grade-2',
      systolicDetermines: systolic >= 160,
      diastolicDetermines: diastolic >= 100,
    }
  }

  if (systolic >= 140 && diastolic < 90) {
    return {
      category: 'isolated-systolic',
      systolicDetermines: true,
      diastolicDetermines: true,
    }
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'grade-1',
      systolicDetermines: systolic >= 140,
      diastolicDetermines: diastolic >= 90,
    }
  }

  if (systolic >= 130 || diastolic >= 80) {
    return {
      category: 'borderline',
      systolicDetermines: systolic >= 130,
      diastolicDetermines: diastolic >= 80,
    }
  }

  return {
    category: 'normal',
    systolicDetermines: true,
    diastolicDetermines: true,
  }
}

export class BloodPressureClassifier {
  static getClassification(
    category: BloodPressureCategory,
  ): BloodPressureClassification {
    const classification = CLASSIFICATIONS[category]

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
    const categoryResult = classifyCategory(systolic, diastolic)

    const classification = this.getClassification(
      categoryResult.category,
    )

    const safetyWarnings: BloodPressureClassificationResult['safetyWarnings'] = []

    if (diastolic < 60) {
      safetyWarnings.push('low-diastolic')
    }

    return {
      ...classification,
      systolic,
      diastolic,
      determiningPressures: {
        systolic: categoryResult.systolicDetermines,
        diastolic: categoryResult.diastolicDetermines,
      },
      safetyWarnings,
    }
  }
}
