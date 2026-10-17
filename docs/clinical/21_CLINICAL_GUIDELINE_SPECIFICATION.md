# Especificación de ClinicalGuideline

**Estado:** especificación contrastada con `src/domain/clinical/models/ClinicalGuideline.ts` y `src/domain/clinical/targets/` el 17-10-2026.

## 1. Contrato actual

`ClinicalGuideline` es un objeto de metadatos con:

- Identidad: `id`.
- Identificación: `name`, `organization`, `version`, `publicationYear`.
- Fuente y trazabilidad bibliográfica opcional: `source`, `sourceDocument`, `reference`.
- Aplicabilidad: `population`, `clinicalArea`.
- Descripción: `description`.

El contrato no incluye un arreglo de reglas ejecutables, tablas de umbrales ni recomendaciones estructuradas.

## 2. Guía argentina activa

`ConsensoArgentinaHTA2025` registra el Consenso Argentino de Hipertensión Arterial 2025 y se usa como guía predeterminada del análisis. Los objetivos terapéuticos están en un módulo separado y son recuperados por `ClinicalTargetRepository`.

## 3. Separación real de reglas y objetivos

Las reglas ejecutables están en `src/domain/clinical/rules/`, y los objetivos en `src/domain/clinical/targets/guidelines/`. Por tanto, el principio anterior de que las reglas “pertenecen a ClinicalGuideline” no describe la implementación actual. La guía aporta metadata e identificador para seleccionar la configuración que el código conoce.

El repositorio de objetivos solo reconoce actualmente el identificador argentino 2025. Las otras fuentes aceptadas por `GuidelineSource` no tienen objetivos equivalentes registrados en este repositorio.

## 4. Selección contextual: límites actuales

`ClinicalTargetSelector` separa población en `mayores_80` si `age >= 80`, y `adultos_16_79` en caso contrario. No valida el límite inferior de edad. Cuando no encuentra un objetivo cuyas condiciones coincidan, devuelve el primer objetivo de la población, incluso si las condiciones de ese objetivo no se cumplen. Además, la condición `buena_tolerancia` actualmente devuelve `false`, por lo que el objetivo deseable condicionado por ella no se selecciona.

Estos comportamientos son límites de la implementación observada, no recomendaciones clínicas.

## 5. Requisitos de evolución

Antes de ampliar el modelo se debe definir cómo versionar reglas, objetivos, poblaciones, referencias y aplicabilidad; cómo conservar trazabilidad por hallazgo; y cómo probar datos ausentes, edad límite y condiciones que no coinciden. No presentar una guía como totalmente soportada hasta que sus reglas y objetivos estén implementados y validados.