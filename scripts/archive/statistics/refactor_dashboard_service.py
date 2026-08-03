from pathlib import Path

path = Path("src/features/dashboard/services/DashboardService.ts")
text = path.read_text(encoding="utf-8")

# Agregar import
old_import = "import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'"
new_import = """import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { StatisticsDomainService } from '@/domain/statistics/services'"""

text = text.replace(old_import, new_import, 1)

# Insertar summary antes del return
old = "    return {"
new = """    const summary =
      StatisticsDomainService.getSummary(records)

    return {"""

text = text.replace(old, new, 1)

# Reemplazos de campos
replacements = {
    "totalMeasurements: records.length,": "totalMeasurements: summary.totalMeasurements,",
    """averageSystolic: Math.round(
        records.reduce(
          (sum, r) => sum + r.systolic,
          0,
        ) / records.length,
      ),""": "averageSystolic: Math.round(summary.averageSystolic),",
    """averageDiastolic: Math.round(
        records.reduce(
          (sum, r) => sum + r.diastolic,
          0,
        ) / records.length,
      ),""": "averageDiastolic: Math.round(summary.averageDiastolic),",
    """averageHeartRate:
        heartRateCount === 0
          ? null
          : Math.round(
              averageHeartRate /
                heartRateCount,
            ),""": """averageHeartRate:
        heartRateCount === 0
          ? null
          : Math.round(summary.averageHeartRate ?? 0),"""
}

for old_block, new_block in replacements.items():
    text = text.replace(old_block, new_block)

path.write_text(text, encoding="utf-8")
print("DashboardService refactorizado.")
