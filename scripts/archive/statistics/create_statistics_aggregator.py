from pathlib import Path

root = Path("src/domain/statistics")

(root / "models").mkdir(parents=True, exist_ok=True)
(root / "services").mkdir(parents=True, exist_ok=True)

(root / "models" / "StatisticsMetrics.ts").write_text(
"""export interface StatisticsMetrics {
  systolic: number[]
  diastolic: number[]
  heartRate: number[]
  pulsePressure: number[]
  meanArterialPressure: number[]
}
""",
encoding="utf-8",
)

(root / "services" / "StatisticsAggregator.ts").write_text(
"""import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

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
        .filter((v): v is number => v !== undefined),

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
""",
encoding="utf-8",
)

models_index = root / "models" / "index.ts"
text = models_index.read_text(encoding="utf-8")

if "StatisticsMetrics" not in text:
    text += "\nexport * from './StatisticsMetrics'\n"

models_index.write_text(text, encoding="utf-8")

services_index = root / "services" / "index.ts"
text = services_index.read_text(encoding="utf-8")

if "StatisticsAggregator" not in text:
    text += "\nexport * from './StatisticsAggregator'\n"

services_index.write_text(text, encoding="utf-8")

print("StatisticsAggregator created.")
