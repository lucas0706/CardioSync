# ClinicalGuideline

**Estado:** modelo y soporte contrastados con `feature/app-updates` el 17-10-2026.

## 1. Modelo actual

`src/domain/clinical/models/ClinicalGuideline.ts` define metadatos de una guía:

- `id`, `name`, `organization`;
- `version`, `publicationYear`;
- `source`, `sourceDocument`, `reference`;
- `population`, `clinicalArea`, `description`.

Este modelo identifica la fuente de conocimiento; no contiene ni ejecuta por sí mismo las reglas.

## 2. Guía predeterminada

`ConsensoArgentinaHTA2025` registra el Consenso Argentino de Hipertensión Arterial 2025, con identificador `consenso-hta-argentina-2025`. `ClinicalAnalysisDomainService` usa esta guía cuando no se proporciona otra.

## 3. Reglas y objetivos: ubicación real

Las reglas ejecutables están en `src/domain/clinical/rules/`. Los objetivos terapéuticos argentinos están definidos separadamente en `src/domain/clinical/targets/guidelines/ConsensoArgentinaHTA2025Targets.ts` y se recuperan mediante `ClinicalTargetRepository`. El selector actual solo encuentra objetivos para el identificador de la guía argentina.

Por eso, la frase «las reglas pertenecen a ClinicalGuideline» describe una intención conceptual, no la estructura implementada: la guía contiene metadatos y las reglas/objetivos están en módulos separados.

## 4. Soporte de varias guías

Hay documentos de AHA/ACC, ESC e ISH en la base documental, y el tipo `GuidelineSource` reconoce esos orígenes. No se encontró soporte equivalente de reglas y objetivos ejecutables para esas guías en el motor actual.

## 5. Trazabilidad y límites

Los hallazgos reciben el identificador de la guía usada cuando está disponible. El modelo actual no registra una versión del motor ni una instantánea completa de las entradas para reproducir de forma inmutable cada análisis histórico.

Una guía registrada no significa que todas sus recomendaciones estén implementadas. La incorporación de nuevas reglas requiere referencias verificables, revisión clínica, pruebas y versionado explícito.