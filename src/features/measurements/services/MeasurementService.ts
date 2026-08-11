import { bloodPressureRepository } from '@/core/database/BloodPressureRepository'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export class MeasurementService {
  getAll(): BloodPressureRecord[] {
    return bloodPressureRepository.getAll()
  }

  create(record: BloodPressureRecord): void {
    bloodPressureRepository.create(record)
  }

  existsByMeasurement(
    record: Pick<
      BloodPressureRecord,
      | 'dateTime'
      | 'systolic'
      | 'diastolic'
      | 'heartRate'
      | 'arm'
      | 'position'
      | 'notes'
    >,
  ): boolean {
    return bloodPressureRepository.existsByMeasurement(
      record,
    )
  }

  createMany(records: BloodPressureRecord[]): void {
    bloodPressureRepository.createMany(records)
  }

  update(record: BloodPressureRecord): void {
    bloodPressureRepository.update(record)
  }

  delete(id: string): void {
    bloodPressureRepository.delete(id)
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
