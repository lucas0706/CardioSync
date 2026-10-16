# Brechas documentales y plan de resolución

| Campo | Valor |
|---|---|
| Fecha de elaboración | 2026-10-15 |
| Rama de trabajo | `docs/documentation-audit` |
| Alcance | Inventario documental; sin cambios en código de aplicación |
| Estado | Plan de trabajo; requiere revisión antes de integrar |

## 1. Propósito

Este documento convierte el inventario de archivos vacíos y las discrepancias detectadas en tareas concretas. No reemplaza las especificaciones existentes ni certifica que una funcionalidad funcione en producción.

La auditoría inicial se realizó sobre `feature/app-updates` en el commit `c62b9106f7a1a720b274bb7f386111313d08403e`. Los cambios de esta rama documental deben compararse con la rama y el commit que finalmente se definan como fuente de verdad antes de integrarlos.

## 2. Criterios para resolver una brecha

Cada documento debe recibir una de estas decisiones:

- **Completar:** el documento describe una responsabilidad vigente y hay código, decisiones o fuentes suficientes para respaldarlo.
- **Consolidar:** el contenido ya existe en otro documento y mantener dos copias generaría divergencias. El documento consolidado debe enlazar a la fuente canónica o retirarse en un cambio revisable.
- **Mantener como pendiente:** el tema requiere investigación, pruebas, decisión explícita o fuentes que todavía no se han recopilado.
- **Retirar:** solo cuando se haya confirmado que no tiene referencias útiles, historial que preservar ni consumidores; registrar el motivo en el cambio.

No completar documentos solo para que dejen de estar vacíos. No convertir una intención histórica en una decisión arquitectónica vigente sin confirmación. Cuando ya existe código y extracción de una guía, documentar esa evidencia y distinguirla de la validación pendiente.

## 3. Documentos vacíos: clasificación inicial

### 3.1 Constitución y decisiones arquitectónicas

| Documento | Tratamiento inicial | Evidencia necesaria |
|---|---|---|
| `docs/00_CARDIOSYNC_CONSTITUTION.md` | Completar como principios estables del proyecto, después de revisar y aprobar su alcance | Principios de arquitectura existentes, reglas del proyecto y decisiones vigentes |
| `docs/architecture/adr/ADR-001-blood-pressure-record-is-the-core.md` | Revisar y completar si la decisión sigue vigente | Modelo de medición, servicios de dominio y decisiones relacionadas |
| `docs/architecture/adr/ADR-002-clinical-context-is-optional.md` | Revisar y completar si la decisión sigue vigente | Tipos, validaciones y consumidores de contexto clínico |
| `docs/architecture/adr/ADR-003-clinical-analysis-is-independent.md` | Revisar y completar si la decisión sigue vigente | Dependencias del motor de análisis y pruebas disponibles |
| `docs/architecture/adr/ADR-004-guideline-strategy-pattern.md` | Mantener pendiente hasta comprobar que ese patrón existe realmente | Implementación de estrategias y selección de guías |
| `docs/architecture/adr/ADR-005-clinical-rules-must-have-traceability.md` | Completar como política solo con fuentes trazables | Definición de reglas, referencias y mecanismo de trazabilidad |
| `docs/architecture/adr/ADR-006-specification-before-implementation.md` | Revisar si corresponde a una norma de proceso o a una decisión histórica | Flujo de desarrollo y normas documentales actuales |
| `docs/architecture/adr/ADR-007-clinical-context-represents-a-measurement.md` | Revisar; no asumir que el contexto es idéntico a la medición | Modelos de medición y contexto y sus relaciones |
| `docs/architecture/adr/ADR-008-clinical-context-is-a-composite-aggregate.md` | Mantener pendiente hasta confirmar el modelo agregado | Tipos, constructores, invariantes y uso del contexto |
| `docs/architecture/adr/ADR-009-domain-is-data-source-agnostic.md` | Revisar y completar si el dominio no depende de infraestructura | Imports y dependencias reales del dominio |
| `docs/architecture/adr/ADR-010-smart-context-construction.md` | Mantener pendiente hasta precisar qué significa “smart” y verificar su implementación | Constructores, reglas de selección y casos de prueba |

Los ADR deben utilizar un formato uniforme: estado (propuesto/aceptado/reemplazado), contexto, decisión, consecuencias, alternativas y referencias. No crear una decisión retrospectiva como si hubiera sido aprobada en una fecha histórica sin evidencia.

### 3.2 Documentación clínica

| Documento | Tratamiento inicial | Evidencia necesaria |
|---|---|---|
| `docs/clinical/00_INTRODUCTION.md` | Completar con alcance, límites y navegación de la documentación clínica | Documentos clínicos existentes y reglas implementadas |
| `docs/clinical/05_ANTHROPOMETRY.md` | Mantener pendiente hasta revisar modelos y fórmulas implementados | Campos, unidades, validaciones y fórmulas en código |
| `docs/clinical/09_CLINICAL_GUIDELINE.md` | Completar como índice de fuentes y estado de soporte, no como guía médica nueva | Fuentes oficiales, versión, fecha de consulta y reglas realmente codificadas |
| `docs/clinical/17_IMPLEMENTATION_ROADMAP.md` | Consolidar o sincronizar con el roadmap principal para evitar dos planes contradictorios | `docs/02_ROADMAP.md`, estado del código y decisiones aprobadas |
| `docs/clinical/guidelines/AHA_ACC_2025.md` | Mantener pendiente de investigación documental | Documento oficial identificable, versión, publicación y secciones relevantes |
| `docs/clinical/guidelines/ARGENTINA_2025.md` | Documentar implementación existente; completar trazabilidad y validación | Fuente primaria por regla, coincidencia de umbrales, población, casos límite y pruebas |
| `docs/clinical/guidelines/ESC_2024.md` | Mantener pendiente de investigación documental | Documento oficial, versión, recomendaciones y alcance |
| `docs/clinical/guidelines/ISH_2020.md` | Mantener pendiente; comprobar vigencia antes de usar como referencia activa | Fuente oficial, estado de vigencia y relación con recomendaciones actuales |

**Regla clínica:** no inventar umbrales, recomendaciones, referencias bibliográficas ni equivalencias entre guías. Distinguir claramente la fuente publicada, la interpretación del equipo y la regla implementada en CardioSync. Si no se dispone de la fuente primaria, dejarlo explícitamente pendiente.

### 3.3 Gestión operativa del proyecto

| Documento | Tratamiento inicial | Evidencia necesaria |
|---|---|---|
| `project/BACKLOG.md` | Consolidar con una fuente de trabajo activa o reconstruir desde issues/roadmap verificables | Issues, tareas abiertas y decisiones actuales |
| `project/CHECKLIST.md` | Completar como checklist operativo si aporta controles distintos de la guía de desarrollo | `docs/17_DEVELOPMENT_WORKFLOW.md` y controles de release |
| `project/DECISIONS.md` | Consolidar con `docs/03_DECISIONS.md` salvo que tenga un propósito diferente demostrado | Referencias, historial y decisiones únicas |
| `project/MILESTONES.md` | Consolidar con el roadmap principal o reconstruir hitos desde checkpoints | Releases, commits y checkpoints con fechas verificables |
| `project/ROADMAP.md` | Evitar mantener un segundo roadmap sin propietario; contrastar con `docs/02_ROADMAP.md` | Plan aprobado y estado de la rama fuente |

## 4. Discrepancias de contenido no vacío

Además de los archivos vacíos, la auditoría inicial encontró estados documentales que no coinciden claramente con el código disponible:

1. **Metadatos de versión:** la rama auditada declara `1.2.0` en `app.json` y `package.json`, pero los archivos de información de la app muestran `1.1.0`; también hay una discrepancia documentada de versión de React Native. Debe determinarse la fuente de verdad antes de editar valores.
2. **Estado de dominios:** los documentos de dominio clínico, motor de reglas y análisis conservan estados de desarrollo que pueden estar desactualizados. La presencia de clases no demuestra que todos los escenarios estén probados.
3. **Reportes y Health Connect:** actualizar el estado documental únicamente después de mapear entradas, servicios, permisos, errores y resultados observables.
4. **Base de datos y copias:** mantener diferenciadas persistencia local, copia, restauración e importación de datos externos. Documentar explícitamente los efectos destructivos de restaurar.
5. **Roadmaps duplicados:** evitar que documentos generales y clínicos indiquen órdenes o estados distintos sin declarar cuál prevalece.

Estos puntos son hallazgos para verificar, no autorización para cambiar código, metadatos de versión o reglas clínicas durante esta tarea documental.

## 5. Orden de ejecución recomendado

1. Confirmar la rama y el commit que serán fuente de verdad antes de integrar documentación.
2. Completar el mapa de arquitectura con evidencia del árbol de código y dependencias entre módulos.
3. Contrastar backup/restauración, importación/exportación, Health Connect, reportes y actualizaciones con servicios y configuración actuales.
4. Resolver metadatos de versión como una tarea separada, después de inspeccionar todas las fuentes y la configuración Expo efectiva.
5. Aprobar un formato de ADR y resolver los diez registros uno por uno.
6. Investigar las fuentes clínicas primarias antes de escribir contenido específico de guías.
7. Consolidar backlog, checklist, decisiones, hitos y roadmaps duplicados sin perder historial.
8. Revisar enlaces, ortografía, consistencia, diff y estado Git; abrir revisión antes de integrar.

## 6. Criterios de cierre

La brecha documental se considera resuelta cuando:

- el documento tiene un propósito explícito y una fuente canónica identificada;
- los estados diferencian diseño, implementación y validación;
- las afirmaciones técnicas se respaldan en código/configuración o pruebas identificadas;
- las afirmaciones clínicas incluyen fuente primaria, versión y trazabilidad;
- los documentos duplicados se consolidaron o explicaron;
- los enlaces internos funcionan;
- se registró el cambio en el changelog;
- no se mezclaron cambios funcionales con la rama documental.

## 7. Alcance y limitaciones

Este plan se basa en la auditoría estática registrada en `docs/00_DOCUMENTATION_AUDIT_2026-10-15.md`. No se ejecutaron compilaciones, pruebas automatizadas ni pruebas en dispositivo para elaborar este documento. Las decisiones propuestas son iniciales y deben revisarse contra la rama fuente de verdad antes de integrar.


## 5. Avance de resolución — 2026-10-15

Se completaron dos documentos de orientación que no requieren inventar reglas clínicas:

- `docs/00_CARDIOSYNC_CONSTITUTION.md`: principios rectores propuestos, con distinción entre diseño, implementación, validación y publicación. Queda sujeto a revisión antes de considerarse política formal aprobada.
- `docs/clinical/00_INTRODUCTION.md`: alcance de la documentación clínica, navegación y requisitos de trazabilidad entre fuente publicada, interpretación del proyecto, regla implementada y validación.

Estos documentos no modifican código, reglas clínicas ni configuración. No constituyen validación médica ni certificación de cumplimiento.

## 6. Próximo orden de resolución

1. Revisar la arquitectura y el dominio actuales para completar ADR solo cuando la decisión pueda demostrarse con código y consumidores.
2. Completar el índice de guías clínicas sin introducir umbrales o recomendaciones sin fuente primaria verificable.
3. Inspeccionar el modelo antropométrico antes de documentar fórmulas, unidades o rangos.
4. Resolver los documentos operativos duplicados frente a roadmap, changelog y flujo de desarrollo.
5. Validar enlaces, revisar cambios en Codespaces y preparar una solicitud de integración después de confirmar la rama fuente de verdad.

La auditoría permanece abierta. No se considera resuelta hasta verificar los documentos restantes y revisar la integración contra el estado local del repositorio.


## 7. Avance de arquitectura — 2026-10-15

Se redactó un borrador para `docs/architecture/adr/ADR-001-blood-pressure-record-is-the-core.md`. El estado es **propuesto para revisión**, no aprobado formalmente. El documento separa la decisión propuesta de la evidencia inspeccionada y explicita qué aspectos siguen sin validación integral.

No se completaron automáticamente los otros ADR vacíos: cada uno requiere comprobar su afirmación específica contra el código, las pruebas y las decisiones existentes. En particular, el patrón de estrategias de guías y la construcción “inteligente” de contexto no deben documentarse como hechos hasta encontrar evidencia concreta.


## Corrección de auditoría — guía argentina

La revisión posterior confirmó que el Consenso Argentino de Hipertensión Arterial 2025 ya está referenciado en `src/domain/clinical/guidelines/ConsensoArgentinaHTA2025.ts`, implementado en el clasificador y en objetivos terapéuticos, y documentado mediante extracciones. Por eso, su estado se corrigió de «investigación pendiente» a «implementación y extracción presentes; trazabilidad y validación integral pendientes». No se afirma que toda la guía esté implementada o validada.


### Hallazgos de objetivos terapéuticos argentinos

La revisión estática de `ClinicalTargetSelector`, `ClinicalTargetMatcher`, `ConsensoArgentinaHTA2025Targets` y `TherapeuticTargetRule`, contrastada con la extracción `004_objetivos_terapeuticos_poblaciones.md`, identificó:

- La condición `buena_tolerancia` se evalúa siempre como falsa, por lo que el objetivo deseable condicionado a tolerancia no puede seleccionarse mediante el matcher actual.
- No se encontró en el arreglo de objetivos revisado una entrada específica para hipertensión sistólica aislada en personas de 65–79 años, aunque la extracción documenta ese escenario.
- La extracción contempla fragilidad e individualización, pero el selector/matcher inspeccionado no muestra una condición de fragilidad.
- La regla de objetivo terapéutico omite el hallazgo cuando la media PAS es <120 o la PAD <70; debe verificarse qué regla independiente comunica los riesgos o precauciones de estos escenarios.

Son discrepancias estáticas que requieren validar contra la fuente primaria y el modelo completo antes de modificar el código. No se ha afirmado que toda la aplicación carezca de cobertura ni se ha cambiado ninguna regla clínica.


## 8. Seguimiento del contexto clínico y selección de objetivos — 2026-10-15

La inspección estática del flujo de análisis y perfil en la rama documental amplía los hallazgos anteriores:

- `ClinicalAnalysisDomainService` entrega `input.context` como contexto clínico a las reglas y usa el Consenso Argentino 2025 por defecto cuando no se proporciona otra guía.
- `ClinicalProfileService` lee y guarda el `ClinicalContext` a través de `clinicalProfileRepository`; el hook `useClinicalProfile` lee el perfil local identificado por `LOCAL_PROFILE_ID`. En los archivos inspeccionados no aparece un constructor separado que complete o normalice automáticamente tolerancia o fragilidad.
- `ClinicalContext.age`, `diabetes` y `chronicKidneyDisease` son opcionales. El selector clasifica edades `>=80` como `mayores_80` y cualquier otro caso —incluida edad ausente— como `adultos_16_79`. El selector no valida en ese punto el límite inferior de 16 años.
- El selector filtra por población y condiciones, ordena por prioridad y, si no encuentra un objetivo que cumpla las condiciones, usa el primer objetivo de esa población como fallback. Esto explica por qué la condición `buena_tolerancia` falsa cae al objetivo base, pero también requiere pruebas para evitar que un contexto incompleto se interprete como población general.
- Los objetivos de diabetes y enfermedad renal crónica no exigen explícitamente `buena_tolerancia` en sus condiciones, aunque sus descripciones dicen «cuando es tolerado». El comportamiento y la fuente primaria deben revisarse antes de cambiar esa modelización.
- `TherapeuticTargetRule` omite el hallazgo de objetivo si la media PAS es <120 o la PAD <70. La auditoría actual no verificó todavía qué regla independiente genera alertas para esos valores ni si el contexto clínico se construye igual en todos los consumidores.

**Conclusión limitada:** se verificó el cableado entre el perfil, el servicio de análisis y la regla de objetivos en los archivos inspeccionados. No se verificó en ejecución la persistencia, la entrada de datos del perfil, la invocación desde todas las pantallas ni la cobertura de reglas de seguridad.

### Próxima auditoría técnica

1. Localizar todos los consumidores de `ClinicalAnalysisDomainService.analyze()` y confirmar qué contexto le entregan.
2. Inspeccionar `ClinicalProfileRepository`, el formulario de perfil y validaciones de edad/campos.
3. Inspeccionar `BloodPressureSafetyRule` y sus consumidores para los casos PAS <120 y PAD <70.
4. Contrastar los objetivos y condiciones con el PDF fuente antes de decidir cambios.
5. Añadir pruebas unitarias para edad ausente, edades fuera de población, prioridad entre comorbilidades, fallback y condiciones de tolerancia.
6. No cambiar código clínico hasta cerrar esos puntos y revisar la fuente primaria.
