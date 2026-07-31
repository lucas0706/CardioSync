import { bloodPressureRepository } from '@/core/database/BloodPressureRepository'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export class MeasurementService {
  getAll(): BloodPressureRecord[] {
    return bloodPressureRepository.getAll()
  }

  create(record: BloodPressureRecord): void {
    bloodPressureRepository.create(record)
  }

  count(): number {
    return bloodPressureRepository.count()
  }

  clear(): void {
    bloodPressureRepository.clear()
  }
}

export const measurementService =
  new MeasurementService()
