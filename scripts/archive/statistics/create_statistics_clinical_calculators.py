from pathlib import Path

root = Path("src/domain/statistics/calculators")

files = {
    "HypertensionLoadCalculator.ts": """export class HypertensionLoadCalculator {
  static calculate(
    systolic: number[],
    diastolic: number[],
    targetSystolic = 135,
    targetDiastolic = 85,
  ): number {
    if (systolic.length === 0) return 0

    let elevated = 0

    for (let i = 0; i < systolic.length; i++) {
      if (
        systolic[i] >= targetSystolic ||
        diastolic[i] >= targetDiastolic
      ) {
        elevated++
      }
    }

    return (elevated / systolic.length) * 100
  }
}
""",

    "TimeInTargetCalculator.ts": """export class TimeInTargetCalculator {
  static calculate(
    systolic: number[],
    diastolic: number[],
    targetSystolic = 135,
    targetDiastolic = 85,
  ): number {
    if (systolic.length === 0) return 0

    let inTarget = 0

    for (let i = 0; i < systolic.length; i++) {
      if (
        systolic[i] < targetSystolic &&
        diastolic[i] < targetDiastolic
      ) {
        inTarget++
      }
    }

    return (inTarget / systolic.length) * 100
  }
}
""",

    "AdherenceCalculator.ts": """import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export class AdherenceCalculator {
  static calculate(records: BloodPressureRecord[]): number {
    if (records.length <= 1) return 100

    const ordered = [...records].sort(
      (a, b) =>
        new Date(a.dateTime).getTime() -
        new Date(b.dateTime).getTime(),
    )

    let consecutive = 0

    for (let i = 1; i < ordered.length; i++) {
      const previous = new Date(ordered[i - 1].dateTime)
      const current = new Date(ordered[i].dateTime)

      const days =
        Math.abs(current.getTime() - previous.getTime()) /
        86400000

      if (days <= 2) {
        consecutive++
      }
    }

    return (consecutive / (ordered.length - 1)) * 100
  }
}
"""
}

for name, content in files.items():
    (root / name).write_text(content, encoding="utf-8")

index = root / "index.ts"

exports = [
    "export * from './AverageCalculator'",
    "export * from './MaxCalculator'",
    "export * from './MeanArterialPressureCalculator'",
    "export * from './MinCalculator'",
    "export * from './PulsePressureCalculator'",
    "export * from './StandardDeviationCalculator'",
    "export * from './TrendCalculator'",
    "export * from './VariabilityCalculator'",
    "export * from './HypertensionLoadCalculator'",
    "export * from './TimeInTargetCalculator'",
    "export * from './AdherenceCalculator'",
]

index.write_text("\n".join(exports) + "\n", encoding="utf-8")

print("Clinical calculators created.")
