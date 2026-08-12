import type { DashboardMetrics } from '@/domain/dashboard/DashboardMetrics'
import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { bloodPressureRepository } from '@/core/database/BloodPressureRepository'

export class MeasurementService {
  getAll(): BloodPressureRecord[] {
    return bloodPressureRepository.getAll()
  }

  getDashboardMetrics(): DashboardMetrics {
    return bloodPressureRepository.getDashboardMetrics()
  }

  getByDateRange(
    startDate: string,
    endDate?: string,
  ): BloodPressureRecord[] {
    return bloodPressureRepository.getByDateRange(
      startDate,
      endDate,
    )
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

  createMany(
    records: BloodPressureRecord[],
  ): void {
    bloodPressureRepository.createMany(
      records,
    )
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
