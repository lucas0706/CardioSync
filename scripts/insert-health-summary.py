from pathlib import Path

file = Path(
    "src/features/dashboard/screens/v2/HomeV2Screen.tsx"
)

content = file.read_text()

if "HealthSummaryCard" not in content:
    content = content.replace(
        "import {\n  useClinicalProfile,\n} from '@/features/profile/hooks'\n",
        "import {\n  useClinicalProfile,\n} from '@/features/profile/hooks'\n\nimport {\n  HealthSummaryCard,\n} from '@/features/dashboard/components/HealthSummaryCard'\n",
    )

marker = """
        </View>

        <View style={styles.bottomSpace} />
"""

replacement = """
        </View>

        <HealthSummaryCard />

        <View style={styles.bottomSpace} />
"""

if "<HealthSummaryCard />" not in content:
    content = content.replace(
        marker,
        replacement,
    )

file.write_text(content)

print("HomeV2Screen actualizado")
