import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import {
  MeanArterialPressureCalculator,
  PulsePressureCalculator,
} from '../calculators'

import type { StatisticsMetrics } from '../models/StatisticsMetrics'

export class StatisticsAggregator {
  static aggregate(
    records: BloodPressureRecord[],
  ): StatisticsMetrics {
    return {
      systolic: records.map(r => r.systolic),

      diastolic: records.map(r => r.diastolic),

      heartRate: records
        .map(r => r.heartRate)
        .filter(
          (value): value is number =>
            value !== undefined && Number.isFinite(value),
        ),

      pulsePressure: records.map(r =>
        PulsePressureCalculator.calculate(
          r.systolic,
          r.diastolic,
        ),
      ),

      meanArterialPressure: records.map(r =>
        MeanArterialPressureCalculator.calculate(
          r.systolic,
          r.diastolic,
        ),
      ),
    }
  }
}
