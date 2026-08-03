from pathlib import Path

path = Path("src/features/dashboard/services/StatisticsService.ts")
text = path.read_text(encoding="utf-8")

import_line = (
    "import { StatisticsDomainService } "
    "from '@/domain/statistics/services'"
)

if import_line not in text:
    text = text.replace(
        "import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'",
        "import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'\n"
        + import_line,
    )

if "private readonly summary =" not in text:
    text = text.replace(
        "  ) {}\n",
        """  ) {}

  private readonly summary =
    StatisticsDomainService.getSummary(
      this.records,
    )

""",
        1,
    )

path.write_text(text, encoding="utf-8")

print("StatisticsService preparado para usar el dominio.")
