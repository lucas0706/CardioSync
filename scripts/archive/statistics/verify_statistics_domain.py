from pathlib import Path

root = Path("src/domain/statistics")

expected = [
    "calculators",
    "engines",
    "filters",
    "models",
    "services",
    "types",
    "utils",
]

print("\n=== DIRECTORIOS ===")
for folder in expected:
    p = root / folder
    print(f"{folder:15} {'OK' if p.exists() else 'MISSING'}")

print("\n=== ARCHIVOS TS ===")
for f in sorted(root.rglob("*.ts")):
    print(f.relative_to(root))
