# AHA/ACC High Blood Pressure Guideline 2025

| Campo | Valor |
|---|---|
| Título oficial | 2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation and Management of High Blood Pressure in Adults |
| Organizaciones principales | American Heart Association (AHA) y American College of Cardiology (ACC), con organizaciones colaboradoras indicadas en la publicación |
| Publicación | Circulation. 2025;152:e114–e218 |
| DOI | https://doi.org/10.1161/CIR.0000000000001356 |
| Publicación paralela | Hypertension. 2025;82:e212–e316. DOI: https://doi.org/10.1161/HYP.0000000000000249 |
| Estado de fuente | Publicación primaria identificada |
| Estado de implementación en CardioSync | No se encontró una implementación AHA/ACC 2025 seleccionable en el código inspeccionado de `main` |
| Última verificación documental | 2026-10-17 |

## Fuentes primarias

- [Artículo oficial en Circulation](https://doi.org/10.1161/CIR.0000000000001356)
- [Artículo oficial en Hypertension](https://doi.org/10.1161/HYP.0000000000000249)
- [Centro de recursos de AHA Professional Heart Daily](https://professional.heart.org/en/guidelines-statements/2025-ahaaccaanpaapaabcaccpacpmagsamaaspcnmapcnasgim-guideline-for-thecir0000000000001356)

## Evidencia del repositorio revisado

En `src/clinical/types/ClinicalGuide.ts` y `src/clinical/guides/index.ts` aparece la referencia heredada `accaha2017`, no una entrada `aha2025`. El selector `src/clinical/selector/ClinicalGuideSelector.ts` solo construye explícitamente los motores `cardiosync` y `esc2024`; los demás identificadores caen en el motor CardioSync.

Esto describe el código observado en `main`, no demuestra que ninguna rama de desarrollo contenga trabajo adicional.

## Alcance pendiente

Este archivo registra identificación bibliográfica y estado de integración. No resume ni reproduce recomendaciones clínicas de la guía.

Antes de considerar la guía implementada se debe:

1. Determinar qué recomendaciones concretas se pretende soportar y para qué población.
2. Registrar sección, tabla o recomendación exacta de la fuente primaria para cada regla propuesta.
3. Comparar esa especificación con el comportamiento del código actual y las reglas de otras guías, sin mezclar umbrales.
4. Definir casos de prueba, incluidos valores fronterizos y escenarios discordantes de presión sistólica y diastólica.
5. Obtener revisión clínica y documentar por separado validación técnica y clínica.

No utilizar la identificación bibliográfica como evidencia de que la guía está implementada o validada.
