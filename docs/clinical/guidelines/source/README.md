# Fuentes de guías clínicas

Este directorio documenta la procedencia de las recomendaciones que se evalúen para las reglas clínicas de CardioSync. Una referencia bibliográfica no significa que exista soporte ejecutable en la aplicación.

## Estado actual

- **Argentina 2025:** guía predeterminada configurada en el código. Hay clasificación y objetivos terapéuticos implementados; la correspondencia exacta con la fuente primaria debe validarse y documentarse.
- **ESC 2024:** referencia de comparación pendiente; no hay motor u objetivos ESC identificados en el código auditado.
- **AHA/ACC 2025:** referencia de comparación pendiente; no hay motor u objetivos AHA/ACC identificados en el código auditado.
- **ISH 2020:** referencia internacional pendiente de revisión de vigencia y extracción; no hay motor u objetivos ISH identificados en el código auditado.

## Reglas de gobernanza

1. Cada umbral clínico debe tener una fuente primaria verificable, con sección y página.
2. No mezclar umbrales de guías distintas dentro de una misma regla sin una decisión explícita, versionada y revisada clínicamente.
3. Separar clasificación diagnóstica de consultorio, umbrales de presión domiciliaria y objetivos terapéuticos.
4. Identificar los umbrales codificados como constantes fijas cuando no dependan de la guía seleccionada.
5. Registrar fecha de consulta y versión de la fuente.
6. No convertir una fuente pendiente en una afirmación de soporte clínico.
7. Las modificaciones de criterios deben acompañarse de pruebas para valores en el límite y revisión clínica.

## Estructura

- `INDEX.md`: estado de referencias y soporte.
- `argentina/README.md`: alcance actual y trazabilidad pendiente para la guía predeterminada.
- `ish/README.md`: estado de la referencia internacional.

Las carpetas o fichas específicas de ESC y AHA/ACC deben incorporarse cuando se hayan identificado y verificado las fuentes oficiales correspondientes.
