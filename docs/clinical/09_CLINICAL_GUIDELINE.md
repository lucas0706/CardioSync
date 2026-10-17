# Fuentes de guías clínicas: inventario y trazabilidad

| Campo | Valor |
|---|---|
| Tipo | Registro de fuentes, evidencia de implementación y trazabilidad |
| Estado | Auditoría estática parcial; no equivale a validación clínica |
| Fecha de revisión | 2026-10-17 |
| Commit de referencia | `66db2a571fc2a6ae4612a01a845157128822bfcc` |

## 1. Objetivo

Este documento controla la relación entre las fuentes clínicas consideradas por el proyecto y las reglas de CardioSync. No es una guía médica ni reemplaza los documentos primarios.

La presencia de una referencia bibliográfica, un archivo de extracción o un identificador en el catálogo no demuestra que una guía esté implementada, seleccionada en ejecución o validada clínicamente.

## 2. Estado observado en el código de main

| Referencia | Evidencia en el repositorio | Estado que puede afirmarse |
|---|---|---|
| AHA/ACC 2025 | Fuente primaria identificada; el catálogo heredado contiene `accaha2017`, pero no se encontró un motor AHA/ACC 2025 específico en el selector inspeccionado | Fuente identificada; integración 2025 no demostrada |
| Consenso Argentino 2025 | Hay PDF fuente y archivos de extracción en `docs/clinical/guidelines/source/argentina/` y `docs/clinical/guidelines/extraction/argentina/consenso-2025/`; no se encontró un motor argentino específico en el árbol de código revisado | Fuente y extracción presentes; implementación correspondiente no localizada en el código actual inspeccionado |
| ESC 2024 | `src/clinical/esc2024/classification.ts` y el caso `esc2024` en `src/clinical/selector/ClinicalGuideSelector.ts` | Motor específico presente; concordancia completa con la guía no demostrada |
| ISH 2020 | El identificador aparece en el catálogo, pero el selector no tiene un caso específico para ISH | Discrepancia entre catálogo y motor seleccionable |
| CardioSync personalizada | `src/clinical/cardiosync/classification.ts` y selección explícita en el selector | Motor propio presente; su validez clínica requiere una revisión independiente |

Esta tabla refleja una lectura estática de los archivos de `main` en el commit indicado. No se ejecutó la aplicación ni se verificaron pruebas automatizadas. Los resultados no deben generalizarse a otras ramas.

## 3. Fuentes primarias

- [AHA/ACC 2025](guidelines/AHA_ACC_2025.md)
- [Consenso Argentino 2025](guidelines/ARGENTINA_2025.md)
- [ESC 2024](guidelines/ESC_2024.md)
- [ISH 2020](guidelines/ISH_2020.md)
- [Índice de fuentes archivadas en el repositorio](guidelines/source/INDEX.md)

Las fichas AHA/ACC, ESC e ISH registran identificación bibliográfica y estado de integración. No reproducen recomendaciones de esas publicaciones.

**Licencia ESC:** la página oficial de ESC indica que el uso de contenido de sus guías en software, modelos computacionales o algoritmos requiere un acuerdo formal de licencia. Resolver este punto antes de ampliar o redistribuir contenido derivado de la guía.

## 4. Registro obligatorio por recomendación utilizada

Antes de asociar una guía con una regla de la aplicación, registrar:

- **Fuente:** título, organización/autores, año, versión, DOI o enlace oficial.
- **Ubicación exacta:** capítulo, sección, tabla o recomendación.
- **Alcance:** población, condiciones clínicas, exclusiones y contexto de medición.
- **Interpretación:** cómo se traduce la recomendación a una regla de software y quién aprobó esa interpretación.
- **Implementación:** ruta del archivo y símbolo de código que ejecuta la regla.
- **Validación:** casos de prueba, entradas, resultado esperado y resultado observado.
- **Limitaciones:** escenarios no cubiertos y diferencias con otras guías.
- **Revisión:** fecha, responsable y estado de la comprobación de la fuente.

## 5. Reglas de uso documental

1. No derivar reglas clínicas de nombres de archivos, resúmenes secundarios o recuerdos no verificados.
2. No combinar umbrales de guías distintas sin una decisión explícita y trazable.
3. No presentar una recomendación publicada como comportamiento implementado sin localizar y revisar el código correspondiente.
4. No presentar comportamiento implementado como clínicamente validado sin pruebas y revisión apropiadas.
5. Si la fuente primaria no está disponible o no se ha resuelto su licencia aplicable, mantener la referencia pendiente y no incorporarla como fundamento de nuevas reglas.
6. No asumir que un identificador habilitado en el catálogo corresponde a un motor de clasificación funcional.
7. Registrar diferencias entre guías en lugar de resolverlas silenciosamente.

## 6. Próximas acciones

1. Revisar el [informe de auditoría clínica de octubre de 2026](CLINICAL_GUIDELINE_AUDIT_2026-10-17.md).
2. Verificar la trazabilidad del Consenso Argentino 2025 desde el PDF primario hasta cada regla, y resolver la discrepancia entre documentación y árbol de código.
3. Confirmar la licencia aplicable antes de ampliar el uso de contenido ESC 2024 en software.
4. Decidir si ISH 2020 se mantiene como referencia histórica o se pretende implementar con un motor propio.
5. Determinar el alcance previsto de AHA/ACC 2025 antes de diseñar una implementación.
6. Registrar resultados de pruebas reales y revisión clínica por separado.

Este inventario no certifica funcionamiento, seguridad, cumplimiento regulatorio ni validación clínica.
