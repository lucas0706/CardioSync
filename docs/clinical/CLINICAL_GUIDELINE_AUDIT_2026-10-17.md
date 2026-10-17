# Auditoría de guías clínicas CardioSync — 2026-10-17

| Campo | Valor |
|---|---|
| Tipo | Auditoría documental y lectura estática de fuentes y código |
| Rama base | `main` |
| Commit base | `66db2a571fc2a6ae4612a01a845157128822bfcc` |
| Rama de trabajo | `docs/clinical-guideline-audit-2026-10-17` |
| Alcance | Metadatos de fuentes, catálogo de guías, selector y motores de clasificación |
| Estado | Hallazgos documentados; requiere revisión antes de integrar |

## 1. Límites

La revisión se realizó mediante lectura de archivos disponibles en GitHub y consulta de páginas oficiales. No se ejecutó TypeScript, pruebas, la aplicación ni escenarios clínicos en dispositivo. No se modificó código funcional ni se cambiaron umbrales clínicos.

La auditoría no constituye validación médica ni dictamen legal. La evaluación de licencia señalada para ESC requiere confirmación con el titular de los derechos.

## 2. Hallazgos principales

### 2.1 La documentación anterior afirmaba más de lo que demuestra el código de main

La ficha anterior de Argentina describía clases y rutas bajo `src/domain/clinical/...`. Esas rutas no aparecen en el árbol de `main` inspeccionado. El código actual consultado usa otra estructura, entre ella `src/clinical/cardiosync/classification.ts`, `src/clinical/esc2024/classification.ts` y `src/clinical/selector/ClinicalGuideSelector.ts`.

Hay un PDF argentino y extracciones temáticas en documentación, pero no se localizó un motor de clasificación argentino específico en el código actual inspeccionado.

**Conclusión:** fuente y extracción documental presentes no equivale a implementación argentina demostrada. La documentación se corrigió para expresar esa distinción.

### 2.2 AHA/ACC 2025: fuente primaria identificada, implementación no demostrada

Se identificó la publicación oficial de 2025. El catálogo de guías observado declara `accaha2017`; el selector no tiene un caso AHA/ACC 2025 específico y los identificadores no reconocidos caen en el motor CardioSync.

**Conclusión:** no presentar AHA/ACC 2025 como implementada. Antes de desarrollarla, definir qué recomendaciones se pretenden soportar y su trazabilidad.

Fuente primaria:
- https://doi.org/10.1161/CIR.0000000000001356
- https://doi.org/10.1161/HYP.0000000000000249

### 2.3 ESC 2024: motor presente, concordancia y licencia pendientes

El repositorio contiene `Esc2024Guide` y un caso explícito en el selector. Esto demuestra que existe una implementación etiquetada como ESC 2024, no que cada categoría, límite o recomendación coincida con la fuente oficial.

La página oficial de ESC incluye un corrigendum de febrero de 2025 y declara que el uso de contenido de sus guías en software, modelos computacionales o algoritmos requiere un acuerdo formal de licencia.

**Conclusión:** antes de ampliar o redistribuir contenido derivado de ESC, resolver la licencia aplicable, consultar el corrigendum y verificar regla por regla con la fuente autorizada.

Fuentes:
- https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/
- https://doi.org/10.1093/eurheartj/ehae178

### 2.4 ISH 2020: discrepancia entre catálogo y selector

El catálogo declara `ish2020` como habilitada. El selector no tiene un caso específico ISH; en el flujo inspeccionado, el identificador termina creando el motor CardioSync.

**Conclusión:** el estado habilitado del catálogo no refleja un motor ISH específico seleccionable. Se debe decidir si ISH se conserva como referencia histórica o se implementa deliberadamente.

Fuente primaria:
- https://doi.org/10.1161/HYPERTENSIONAHA.120.15026

### 2.5 Motor CardioSync propio

El motor `CardioSyncGuide` aplica umbrales y etiquetas propias. Esta auditoría no compara exhaustivamente esos umbrales con todas las guías ni afirma su validez clínica.

**Conclusión:** mantenerlo identificado como motor propio, no como sinónimo de AHA, ESC, ISH o del consenso argentino.

## 3. Cambios documentales incluidos en esta rama

- Completa las fichas vacías AHA/ACC 2025, ESC 2024 e ISH 2020 con metadatos, enlaces primarios y límites de lo que puede afirmarse.
- Corrige el inventario `docs/clinical/09_CLINICAL_GUIDELINE.md` para reflejar las rutas y el selector observados en `main`.
- Registra explícitamente las discrepancias de integración y el requisito de revisar el corrigendum y la licencia de ESC.
- No incorpora nuevas reglas clínicas, no cambia código ni dependencias y no modifica la configuración Expo.

## 4. Acciones pendientes, en orden

1. Confirmar con revisión clínica el alcance que debe tener cada guía en CardioSync.
2. Resolver la discrepancia entre la documentación histórica de Argentina y el árbol de código actual; no crear reglas nuevas durante esta tarea documental.
3. Verificar la trazabilidad del consenso argentino desde el PDF incluido hasta cada regla que realmente se pretenda ejecutar.
4. Consultar la publicación ESC y su corrigendum bajo condiciones de acceso autorizadas y resolver la licencia aplicable al software.
5. Decidir el destino de ISH 2020 y el alcance futuro de AHA/ACC 2025.
6. Crear pruebas clínicas de valores frontera solo después de aprobar una especificación trazable.
7. Ejecutar pruebas y registrar resultados reales antes de afirmar conformidad.

## 5. Criterio de cierre

La documentación de una guía puede considerarse completa cuando la fuente primaria y su versión están identificadas, el alcance de uso está aprobado, cada regla tiene ubicación precisa en la fuente y ruta de implementación, los límites y casos de prueba están registrados y la revisión clínica y técnica están documentadas por separado.

Este informe no certifica funcionamiento, seguridad, cumplimiento regulatorio ni validación clínica.
