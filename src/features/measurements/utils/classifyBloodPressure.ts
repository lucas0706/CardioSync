import {
  BLOOD_PRESSURE_CLASSIFICATIONS,
  ClassificationResult,
} from '../constants/classification'

export function classifyBloodPressure(
  systolic: number,
  diastolic: number,
): ClassificationResult {
  if (systolic >= 140 && diastolic < 90) {
    return BLOOD_PRESSURE_CLASSIFICATIONS['isolated-systolic']
  }

  if (systolic >= 180 || diastolic >= 110) {
    return BLOOD_PRESSURE_CLASSIFICATIONS['grade-3']
  }

  if (systolic >= 160 || diastolic >= 100) {
    return BLOOD_PRESSURE_CLASSIFICATIONS['grade-2']
  }

  if (systolic >= 140 || diastolic >= 90) {
    return BLOOD_PRESSURE_CLASSIFICATIONS['grade-1']
  }

  if (systolic >= 130 || diastolic >= 85) {
    return BLOOD_PRESSURE_CLASSIFICATIONS['high-normal']
  }

  if (systolic >= 120 || diastolic >= 80) {
    return BLOOD_PRESSURE_CLASSIFICATIONS.normal
  }

  return BLOOD_PRESSURE_CLASSIFICATIONS.optimal
}
