from pathlib import Path

root = Path("src/domain/statistics")

folders = [
    "calculators",
    "engines",
    "filters",
    "models",
    "types",
    "utils",
]

for folder in folders:
    (root / folder).mkdir(parents=True, exist_ok=True)

files = {
    "index.ts": """\
export * from './calculators';
export * from './engines';
export * from './filters';
export * from './models';
export * from './types';
export * from './utils';
""",
    "calculators/index.ts": "",
    "engines/index.ts": "",
    "filters/index.ts": "",
    "models/index.ts": "",
    "types/index.ts": "",
    "utils/index.ts": "",
}

for relative_path, content in files.items():
    path = root / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

print("Statistics module skeleton created.")
