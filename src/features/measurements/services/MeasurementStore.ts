import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import {
  healthConnectSyncService,
} from '@/features/healthConnect/services/HealthConnectSyncService'

import { measurementService } from './MeasurementService'

type PerformanceWithMemory =
  Performance & {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
    }
  }

type Listener = () => void

class MeasurementStore {
  private measurements: BloodPressureRecord[] = []

  private initialized = false

  private listeners = new Set<Listener>()

  initialize(): void {
    if (this.initialized) {
      return
    }

    this.measurements =
      measurementService.getAll()

    this.initialized = true

    this.notify()
  }

  getSnapshot(): BloodPressureRecord[] {
    return this.measurements
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  refresh(): void {
    this.measurements =
      measurementService.getAll()

    this.notify()
  }

  create(record: BloodPressureRecord): void {
    measurementService.create(record)

    this.measurements = [
      record,
      ...this.measurements,
    ]

    this.notify()

    void healthConnectSyncService
      .exportBloodPressure(record)
      .then((exported) => {
        console.log(
          '[HealthConnect] export result',
          exported,
        )
      })
      .catch((error) => {
        console.error(
          '[HealthConnect] export failed',
          error,
        )
      })
  }

  createMany(
    records: BloodPressureRecord[],
  ): void {
    if (records.length === 0) {
      return
    }

    measurementService.createMany(records)

    this.measurements = [
      ...records,
      ...this.measurements,
    ].sort(
      (a, b) =>
        b.dateTime.localeCompare(
          a.dateTime,
        ),
    )

    this.notify()
  }

  update(
    record: BloodPressureRecord,
  ): void {
    measurementService.update(record)

    this.measurements =
      this.measurements.map(
        current =>
          current.id === record.id
            ? record
            : current,
      )

    this.notify()
  }

  delete(id: string): void {
    measurementService.delete(id)

    this.measurements =
      this.measurements.filter(
        record => record.id !== id,
      )

    this.notify()
  }

  clear(): void {
    measurementService.clear()

    this.measurements = []

    this.notify()
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener()
    }
  }
}

export const measurementStore =
  new MeasurementStore()
