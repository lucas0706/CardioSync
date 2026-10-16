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

No completar documentos solo para que dejen de estar vacíos. No convertir una intención histórica en una decisión arquitectónica vigente sin confirmación.

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
| `docs/clinical/guidelines/ARGENTINA_2025.md` | Mantener pendiente de investigación documental | Publicación oficial del consenso, autores/organización, fecha y secciones relevantes |
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
