# Guía clínica utilizada por CardioSync

| Campo | Valor |
|---|---|
| Guía clínica vigente | Consenso Argentino de Hipertensión Arterial 2025 |
| Organizaciones registradas en el proyecto | Federación Argentina de Cardiología (FAC), Sociedad Argentina de Hipertensión Arterial (SAHA) y Sociedad Argentina de Cardiología (SAC) |
| Referencia bibliográfica registrada | Rev Fed Arg Cardiol. 2025; 54 (Suplemento 6): 5-64 |
| Alcance documental | Única guía clínica utilizada actualmente por CardioSync |
| Última revisión documental | 2026-10-17 |

## 1. Alcance vigente

CardioSync utiliza actualmente como única referencia clínica el **Consenso Argentino de Hipertensión Arterial 2025**. Las reglas clínicas vigentes deben trazarse a esta fuente.

La presencia de otras guías, fichas bibliográficas o documentos de comparación en el repositorio no significa que formen parte del comportamiento clínico actual de la aplicación. Los materiales de otras guías que se conserven deben identificarse claramente como históricos, archivados o no activos y no deben usarse para justificar reglas actuales.

Este documento define el alcance documental; no certifica que todas las recomendaciones del consenso estén implementadas ni que cada regla haya sido validada clínica y técnicamente.

## 2. Fuente primaria y materiales del proyecto

- Ficha del consenso: [Consenso Argentino de Hipertensión Arterial 2025](guidelines/ARGENTINA_2025.md)
- Índice de fuentes: [Índice de fuentes clínicas](guidelines/source/INDEX.md)
- Fuente incluida en el repositorio: `docs/clinical/guidelines/source/argentina/`
- Extracciones temáticas: `docs/clinical/guidelines/extraction/argentina/consenso-2025/`

La referencia bibliográfica registrada en el proyecto es *Rev Fed Arg Cardiol. 2025; 54 (Suplemento 6): 5-64*. Antes de cambiar una regla clínica, debe verificarse directamente el documento primario incluido, su página, sección o tabla y la interpretación que se trasladará al software.

## 3. Trazabilidad obligatoria por regla

Cada regla clínica debe registrar:

- identificación de la fuente y versión;
- sección, tabla, recomendación y página exactas;
- población, condiciones de aplicabilidad y exclusiones;
- interpretación funcional aprobada;
- ruta del archivo y símbolo de código donde se implementa;
- casos de prueba, valores límite, resultados esperados y resultados observados;
- limitaciones conocidas;
- fecha y responsable de revisión clínica y técnica.

## 4. Reglas de mantenimiento

1. No introducir umbrales ni recomendaciones clínicas sin una referencia verificable al Consenso Argentino de Hipertensión Arterial 2025.
2. Mantener separadas la fuente primaria, la interpretación clínica y la implementación.
3. No combinar criterios de otras guías con el consenso argentino dentro de una regla vigente.
4. No declarar una regla validada solo porque exista código o documentación.
5. Revisar los casos límite y el impacto sobre registros históricos, reportes y pruebas antes de cambiar reglas.
6. Mantener los documentos de otras guías fuera del alcance activo; si se conservan por razones históricas o de investigación, etiquetarlos como no activos y evitar que se interpreten como fuentes utilizadas por la aplicación.

## 5. Estado y límites

La documentación existente describe clasificación de presión arterial, objetivos terapéuticos y otras extracciones relacionadas con el consenso. La cobertura completa, la correspondencia exacta con el documento primario y la ejecución satisfactoria de pruebas deben verificarse por separado.

La identificación de una fuente no sustituye la revisión clínica de las reglas implementadas ni las pruebas técnicas. Cualquier declaración de conformidad debe apoyarse en trazabilidad verificable y resultados de validación documentados.
