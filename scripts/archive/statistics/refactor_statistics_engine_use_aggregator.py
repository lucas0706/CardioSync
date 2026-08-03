from pathlib import Path

path = Path("src/domain/statistics/engines/StatisticsEngine.ts")
text = path.read_text(encoding="utf-8")

# Agregar import si no existe
if "StatisticsAggregator" not in text:
    text = text.replace(
        "import type { StatisticsSummary } from '../models'",
        "import { StatisticsAggregator } from '../services'\nimport type { StatisticsSummary } from '../models'",
    )

# Insertar aggregate después de filteredRecords
marker = "    const filteredRecords = filter\n      ? PeriodFilter.apply(records, filter)\n      : records\n"

if marker in text and "const metrics =" not in text:
    replacement = marker + """

    const metrics =
      StatisticsAggregator.aggregate(
        filteredRecords,
      )
"""
    text = text.replace(marker, replacement)

replacements = {
    "const systolic = filteredRecords.map(r => r.systolic)": "const systolic = metrics.systolic",
    "const diastolic = filteredRecords.map(r => r.diastolic)": "const diastolic = metrics.diastolic",
    "const heartRate = filteredRecords\n      .map(r => r.heartRate)\n      .filter((v): v is number => v !== undefined)": "const heartRate = metrics.heartRate",
    "const pulsePressure = filteredRecords.map(r =>\n      PulsePressureCalculator.calculate(\n        r.systolic,\n        r.diastolic,\n      ),\n    )": "const pulsePressure = metrics.pulsePressure",
    "const mapValues = filteredRecords.map(r =>\n      MeanArterialPressureCalculator.calculate(\n        r.systolic,\n        r.diastolic,\n      ),\n    )": "const mapValues = metrics.meanArterialPressure",
}

for old, new in replacements.items():
    text = text.replace(old, new)

path.write_text(text, encoding="utf-8")

print("StatisticsEngine refactored.")
