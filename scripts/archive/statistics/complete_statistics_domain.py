from pathlib import Path

ROOT = Path("src/domain/statistics")

FILES = {
    "services/index.ts": """export * from './StatisticsDomainService'
""",

    "utils/index.ts": """// Reserved for future statistics helpers.
export {}
""",

    "filters/index.ts": """export * from './PeriodFilter'
""",

    "engines/index.ts": """export * from './StatisticsEngine'
""",

    "index.ts": """export * from './calculators'
export * from './engines'
export * from './filters'
export * from './models'
export * from './services'
export * from './types'
export * from './utils'
"""
}

for relative_path, content in FILES.items():
    path = ROOT / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

print("Statistics domain finalized.")
