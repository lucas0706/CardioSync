# CardioSync — Architecture Decision Records (ADR)

| Campo | Valor |
|-------|--------|
| Documento | 03_DECISIONS.md |
| Tipo | Architecture Decision Records |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-22 |

---

# Objetivo

Este documento registra todas las decisiones arquitectónicas relevantes tomadas durante la evolución de CardioSync.

Su finalidad es:

- Preservar el conocimiento del proyecto.
- Evitar volver a discutir decisiones ya tomadas.
- Comprender el motivo de cada decisión.
- Facilitar futuras refactorizaciones.
- Ayudar a diagnosticar errores arquitectónicos.
- Identificar rápidamente el origen de posibles problemas.

---

# Cómo utilizar este documento

Cada decisión se registra mediante un Architecture Decision Record (ADR).

Cada ADR deberá contener como mínimo:

- ID
- Fecha
- Estado
- Contexto
- Problema
- Decisión
- Justificación
- Alternativas descartadas
- Consecuencias
- Qué puede romper esta decisión
- Síntomas
- Cómo diagnosticar el problema
- Archivos afectados
- Documentos relacionados

---

# Estados

| Estado | Significado |
|---------|-------------|
| Activa | La decisión continúa vigente. |
| Reemplazada | Existe una decisión más reciente. |
| Obsoleta | Ya no aplica al proyecto. |

---

# Índice de decisiones

Las decisiones se documentarán utilizando el siguiente formato:

- ADR-001
- ADR-002
- ADR-003
- ADR-004
- ...

Cada nueva decisión deberá agregarse al final del documento respetando la numeración correlativa.



---

# ADR-002

## Título

Los formatos externos se adaptan mediante mappers.

---

## Fecha

2026-08-03

---

## Estado

Activa

---

## Contexto

CardioSync podrá recibir información histórica proveniente de diferentes fuentes externas.

Estas fuentes pueden utilizar:

- Distintos nombres de campos.
- Diferentes formatos de fecha.
- Diferentes estructuras de archivos.
- Diferentes modelos de datos.

Ejemplos:

- CSV.
- Excel.
- Exportaciones de otras aplicaciones.
- Registros personales.

---

## Problema

Modificar el modelo interno de CardioSync para adaptarlo a cada formato externo generaría:

- Alto acoplamiento.
- Entidades demasiado grandes.
- Dificultad de mantenimiento.
- Dependencia de proveedores externos.

---

## Decisión

CardioSync mantendrá un modelo interno propio.

Los formatos externos serán transformados mediante capas específicas:

- Parser.
- Validator.
- Normalizer.
- Mapper.

El resultado final será convertido al modelo interno de CardioSync.

---

## Flujo definido

Fuente externa

↓

Import Layer

↓

Validación

↓

Mapper

↓

BloodPressureRecord

↓

Repository

↓

Database

---

## Justificación

Esta decisión permite:

- Importar históricos de múltiples fuentes.
- Mantener estable el dominio.
- Incorporar nuevos formatos sin modificar entidades principales.
- Separar datos externos del modelo interno.

---

## Consecuencias positivas

- Mayor compatibilidad.
- Mejor mantenibilidad.
- Menor acoplamiento.
- Evolución independiente del dominio.

---

## Consecuencias negativas

- Cada nuevo formato puede requerir un mapper específico.
- Se debe mantener lógica adicional de transformación.

---

## Qué puede romper esta decisión

Modificar:

- BloodPressureRecord.
- Measurement Domain.
- Entidades principales.

para adaptarlas a un archivo externo específico.

---

## Síntomas cuando se rompe

- Muchas propiedades opcionales.
- Modelos difíciles de mantener.
- Dependencias con aplicaciones externas.
- Aumento de complejidad en el dominio.

---

## Diagnóstico

Si una nueva integración requiere modificar entidades centrales, revisar este ADR antes de realizar cambios.

---

## Documentos relacionados

- 09_DATABASE.md
- 01_ARCHITECTURE.md
- 04_CLINICAL_DOMAIN.md


---

# ADR-003

## Título

Separación entre la medición y el contexto clínico

---

## Fecha

2026-08-05

---

## Estado

Activa

---

## Contexto

Durante la Fase 5 se realizó una auditoría completa del dominio de CardioSync.

La auditoría mostró que `BloodPressureRecord` había acumulado información perteneciente a distintos dominios:

- Medición.
- Contexto clínico.
- Antropometría.
- Oxigenación.
- Medicación.
- Síntomas.
- Datos heredados de versiones anteriores.

Esta mezcla dificulta la evolución del dominio y aumenta el acoplamiento entre la medición y la información clínica complementaria.

---

## Problema

`BloodPressureRecord` debe representar exclusivamente una medición de presión arterial.

Toda la información adicional pertenece al contexto clínico del paciente y no a la medición en sí.

Mantener ambos conceptos dentro de la misma entidad dificulta:

- La evolución del dominio.
- La implementación de ClinicalContext.
- La implementación de ClinicalRuleEngine.
- La implementación de ClinicalAnalysisEngine.
- El mantenimiento del modelo.

---

## Decisión

CardioSync separará conceptualmente ambos dominios.

### BloodPressureRecord

Representará únicamente la medición.

Ejemplos:

- Fecha y hora.
- Presión sistólica.
- Presión diastólica.
- Frecuencia cardíaca.
- Brazo.
- Posición.
- Notas.

### ClinicalContext

Representará información clínica opcional asociada a una medición.

Ejemplos:

- Peso.
- Altura.
- IMC.
- Saturación de oxígeno.
- Frecuencia respiratoria.
- Medicación.
- Síntomas cardiovasculares.

ClinicalContext no se implementará durante la Fase 5.

La Fase 5 únicamente prepara el dominio para dicha separación.

---

## Justificación

Esta decisión:

- Reduce el acoplamiento.
- Simplifica BloodPressureRecord.
- Facilita futuras refactorizaciones.
- Evita mezclar conceptos diferentes dentro de una misma entidad.
- Permite que ClinicalContext evolucione de forma independiente.

---

## Alternativas descartadas

Mantener toda la información clínica dentro de BloodPressureRecord.

Se descartó por generar un modelo demasiado grande, difícil de mantener y poco alineado con la arquitectura prevista para las siguientes fases.

---

## Consecuencias

Positivas:

- Dominio más claro.
- Mejor separación de responsabilidades.
- Base sólida para ClinicalRuleEngine.
- Base sólida para ClinicalAnalysisEngine.
- Mejor preparación para futuras integraciones.

Negativas:

- Será necesaria una migración controlada cuando se implemente ClinicalContext.

---

## Qué puede romper esta decisión

- Volver a incorporar información clínica directamente en BloodPressureRecord.
- Utilizar BloodPressureRecord como historia clínica general.

---

## Síntomas

- Aparición de numerosos campos opcionales.
- Mezcla de información de la medición con información del paciente.
- Crecimiento excesivo de BloodPressureRecord.

---

## Diagnóstico

Si un nuevo dato describe el estado del paciente y no la medición de presión arterial, debe evaluarse primero si pertenece a ClinicalContext antes de agregarse al dominio principal.

---

## Archivos afectados

- src/domain/measurements/BloodPressureRecord.ts
- src/core/database/BloodPressureRepository.ts
- src/core/database/init.ts
- docs/13_DOMAIN_REFACTOR.md

---

## Documentos relacionados

- 00_PROJECT_MASTER_CONTEXT.md
- 01_ARCHITECTURE.md
- 02_ROADMAP.md
- 04_CLINICAL_DOMAIN.md
- 13_DOMAIN_REFACTOR.md


---

## Consolidación de la clasificación de presión arterial

**Estado:** Activa.

Se identificaron dos mecanismos que producían findings con el mismo tipo `blood-pressure-classification`:

- `ClinicalClassificationRule`, basado en el árbol histórico `src/clinical/engine`.
- `BloodPressureClassificationRule`, basado en `StatisticsSummary`.

Esto representaba dos fuentes de verdad para la clasificación clínica.

Se decidió mantener `BloodPressureClassificationRule` como la clasificación del Clinical Domain V1 porque Clinical Analysis trabaja sobre el conjunto de mediciones y su `StatisticsSummary`.

`ClinicalClassificationRule` fue eliminado del dominio clínico activo.

El árbol histórico `src/clinical/` no fue eliminado en esta fase. Su migración o retiro deberá tratarse como una tarea arquitectónica independiente.

---


---

## Independencia de períodos entre módulos

**Estado:** Adoptada.

Los módulos de CardioSync no compartirán un único estado global de período.

Cada módulo puede seleccionar independientemente el período que necesita.

Ejemplo:

- Historial: puede mostrar todos los registros sin aplicar un período.
- Estadísticas: puede utilizar 7 días, 30 días, 90 días o un período personalizado.
- Reports: podrá seleccionar independientemente, por ejemplo, 30 días para una exportación.
- Clinical Analysis: analizará el conjunto de datos que corresponda al contexto de análisis y no dependerá de un estado global de período.

La infraestructura de filtrado temporal puede reutilizarse cuando corresponda, pero los modelos de filtro no deben acoplar artificialmente las features entre sí.

`StatisticsFilter` y `PeriodFilter` permanecen actualmente dentro de `src/domain/statistics/`.

No se creará todavía un filtro temporal global ni un nuevo dominio temporal común.

Si en futuras features aparece una necesidad real de compartir únicamente el concepto de rango temporal, se podrá introducir una abstracción común como `DateRange` sin trasladar el estado de período de una feature a otra.

Principio:

**Compartir infraestructura cuando corresponda; mantener independientes las responsabilidades y el estado de cada módulo.**

---


---

## Integración de Clinical Analysis con Statistics

**Estado:** Preparada conceptualmente; integración de UI pendiente.

Statistics ya dispone de:

- período seleccionado;
- registros filtrados;
- StatisticsSummary.

ClinicalAnalysisDomainService recibe:

- measurements;
- StatisticsSummary;
- ClinicalContext;
- guideline.

No se conecta todavía Clinical Analysis directamente a `useStatistics()` porque la aplicación aún no dispone de una fuente de producción para `ClinicalContext`.

El contexto actualmente utilizado en `src/devtools/clinical/` corresponde a escenarios de validación y no debe utilizarse como contexto de producción.

La integración futura deberá proporcionar al Clinical Analysis el mismo conjunto temporal representado por `StatisticsSummary`, junto con un `ClinicalContext` real.

No se introducirá un contexto clínico ficticio ni se acoplará Clinical Analysis a `StatisticsFilter`.

---

## Dependencia histórica de Statistics con Clinical Engine

`StatisticsEngine` todavía acepta opcionalmente `ClinicalEngine` y utiliza `ClinicalClassificationCalculator` para generar `predominantClassification` y `classificationDistribution`.

Esta dependencia pertenece al árbol histórico `src/clinical/` y no debe confundirse con la nueva arquitectura de `src/domain/clinical/`.

Su migración o eliminación se tratará en una fase independiente para evitar modificar simultáneamente Statistics y Clinical Analysis.

---

---

# ADR-004

## Título

Reutilización de la representación visual de mediciones entre Nueva medición, Edición y Detalle

---

## Fecha

2026-08-14

---

## Estado

Activa

---

## Contexto

El rediseño de Measurements V2 requiere mantener una experiencia visual coherente entre los distintos estados de una misma medición.

Nueva medición, edición y detalle representan el mismo concepto funcional desde diferentes modos de interacción.

---

## Problema

Implementar una tarjeta visual diferente para cada pantalla produciría:

- inconsistencias visuales;
- duplicación de componentes;
- mayor costo de mantenimiento;
- diferencias innecesarias entre creación, edición y consulta.

---

## Decisión

Se utilizará una representación visual común para las métricas principales:

- SIS.
- DIA.
- FC.

La misma jerarquía visual se conservará entre:

- Nueva medición.
- Edición.
- Detalle.

El modo de interacción será el que cambie:

- Nueva medición: entrada.
- Edición: entrada con valores precargados.
- Detalle: lectura.

---

## Fecha y hora

Fecha y hora se representan como controles independientes para permitir modificar cada valor sin afectar innecesariamente al otro.

La selección utiliza `@expo/ui`, manteniendo compatibilidad con Expo SDK 57.

---

## Contexto de medición

Brazo y posición utilizan un selector visual específico para evitar reutilizar controles de texto cuando el conjunto de valores es cerrado.

---

## Eliminación

La eliminación desde Detalle requiere confirmación explícita antes de ejecutar la operación persistente.

---

## Justificación

Esta decisión:

- mejora la consistencia visual;
- reduce duplicación;
- facilita mantenimiento;
- permite reutilizar la jerarquía de información;
- mantiene separación entre presentación y lógica de dominio.

---

## Consecuencias

### Positivas

- Experiencia coherente.
- Menor duplicación.
- Evolución visual más controlada.
- Base reutilizable para futuras mejoras.

### Negativas

- Los cambios futuros en la representación común deberán evaluarse sobre los tres estados.

---

## Qué puede romper esta decisión

Crear nuevamente tarjetas independientes para Nueva medición, Edición y Detalle sin una justificación funcional.

---

## Archivos principales relacionados

- `src/features/measurements/components/MeasurementForm.tsx`
- `src/features/measurements/components/MeasurementDetail.tsx`
- `src/features/measurements/components/v2/MeasurementMetricInputCard.tsx`
- `src/features/measurements/components/v2/MeasurementDateTimeField.tsx`
- `src/features/measurements/components/v2/MeasurementOptionSelector.tsx`

---

## Documentos relacionados

- `00_PROJECT_MASTER_CONTEXT.md`
- `01_ARCHITECTURE.md`
- `02_ROADMAP.md`
- `10_CHANGELOG.md`



---

# ADR-005

## Título

El rediseño visual no modifica la lógica de dominio

---

## Fecha

2026-08-22

---

## Estado

Activa

---

## Contexto

CardioSync requirió una evolución visual importante de la interfaz sin alterar
la funcionalidad clínica y estadística existente.

El rediseño debía mejorar:

- jerarquía visual;
- legibilidad;
- navegación;
- consistencia;
- densidad de información;
- presentación de datos clínicos;
- reutilización de componentes.

---

## Problema

Modificar simultáneamente la presentación y la lógica funcional aumentaría el
riesgo de introducir regresiones en:

- mediciones;
- persistencia;
- estadísticas;
- clasificación clínica;
- Clinical Analysis;
- reportes.

---

## Decisión

El Visual Redesign V2 se implementará principalmente en las capas de:

- presentación;
- componentes;
- navegación;
- theme;
- interacción visual.

Las reglas clínicas, cálculos estadísticos, persistencia y contratos de dominio
deben mantenerse independientes de la presentación.

---

## Justificación

Esta separación permite evolucionar la interfaz sin duplicar lógica existente
ni convertir componentes visuales en responsables de decisiones clínicas.

También permite realizar futuras iteraciones visuales con menor riesgo.

---

## Consecuencias positivas

- Menor riesgo de regresiones funcionales.
- Mayor reutilización.
- Separación clara entre UI y dominio.
- Facilita futuras iteraciones visuales.
- Mantiene estable la arquitectura.

---

## Consecuencias negativas

- Algunas mejoras visuales requieren adaptar componentes existentes.
- La interfaz debe consumir correctamente los contratos ya definidos.

---

## Qué puede romper esta decisión

Introducir:

- reglas clínicas dentro de componentes visuales;
- cálculos estadísticos dentro de pantallas;
- persistencia directamente desde componentes;
- lógica de negocio duplicada en la UI.

---

## Diagnóstico

Si un cambio visual requiere modificar reglas clínicas, cálculos o persistencia,
debe revisarse primero la separación de responsabilidades.

---

## Documentos relacionados

- 00_PROJECT_MASTER_CONTEXT.md
- 01_ARCHITECTURE.md
- 02_ROADMAP.md
- 14_VISUAL_REDESIGN_V2.md


---

# ADR-006

## Título

La navegación principal prioriza cuatro áreas de uso

---

## Fecha

2026-08-22

---

## Estado

Activa

---

## Contexto

La evolución de la interfaz requirió simplificar la navegación principal y
reducir la cantidad de destinos visibles simultáneamente.

---

## Decisión

La navegación inferior principal queda definida como:

`Inicio | Registros | Perfil | Más`

Las funcionalidades secundarias se agrupan dentro de `Más`.

Esto incluye:

- Estadísticas;
- Reportes;
- Configuración.

Health Connect pertenece a Configuración y no al Perfil.

---

## Justificación

La decisión separa las áreas de uso frecuente de las funciones secundarias y
evita sobrecargar la navegación inferior.

---

## Consecuencias

- Inicio concentra el resumen principal.
- Registros concentra el historial.
- Perfil concentra información del usuario.
- Más concentra funciones secundarias y configuración.
- La navegación queda preparada para futuras integraciones.

---

## Documentos relacionados

- 02_ROADMAP.md
- 14_VISUAL_REDESIGN_V2.md

---

# ADR-007

## Título

El rediseño visual V2 mantiene la arquitectura funcional existente

---

## Fecha

2026-08-22

---

## Estado

Activa

---

## Contexto

CardioSync completó la implementación del Rediseño Visual V2 definido en `docs/14_VISUAL_REDESIGN_V2.md`.

El rediseño modificó principalmente la presentación de la aplicación:

- jerarquía visual;
- composición de pantallas;
- navegación;
- componentes reutilizables;
- estilos;
- densidad de información;
- interacción visual;
- presentación de información clínica.

Durante la implementación se mantuvieron las funcionalidades existentes y la separación entre presentación, dominio, servicios y persistencia.

---

## Problema

Un rediseño visual de gran alcance puede generar modificaciones innecesarias sobre la lógica funcional y aumentar el acoplamiento entre UI y dominio.

Era necesario establecer explícitamente que la evolución visual no implica una reimplementación de la lógica de negocio.

---

## Decisión

El Rediseño Visual V2 se implementará como una evolución de la capa de presentación sobre la arquitectura existente.

La UI deberá consumir los servicios, hooks, modelos y reglas existentes en lugar de duplicar su lógica.

Las reglas clínicas, cálculos estadísticos, persistencia y servicios funcionales deberán permanecer independientes de los componentes visuales.

Los cambios visuales deberán centralizarse preferentemente en:

- `src/components`
- `src/features`
- `src/theme`

sin trasladar lógica de negocio hacia dichos componentes.

---

## Justificación

Esta decisión permite:

- reducir el riesgo de regresiones;
- mantener estable el dominio;
- reutilizar la lógica existente;
- facilitar futuros rediseños;
- mantener separación de responsabilidades;
- evitar duplicación de reglas clínicas y cálculos;
- preservar la compatibilidad con la arquitectura definida.

---

## Consecuencias positivas

- Menor acoplamiento entre UI y dominio.
- Mayor reutilización de componentes.
- Rediseños futuros más seguros.
- Menor riesgo de alterar funcionalidades existentes.
- Mejor mantenibilidad.
- Mayor consistencia visual mediante componentes compartidos.

---

## Consecuencias negativas

- Algunos cambios visuales requieren adaptar componentes existentes.
- La UI debe respetar los contratos definidos por las capas inferiores.
- No toda modificación visual puede resolverse exclusivamente desde un componente aislado.

---

## Qué puede romper esta decisión

Se considera una violación de esta decisión:

- implementar reglas clínicas directamente en componentes visuales;
- duplicar cálculos estadísticos en la UI;
- acceder directamente a SQLite desde componentes visuales;
- duplicar lógica de persistencia;
- crear modelos paralelos únicamente para representar información visual;
- modificar el dominio únicamente para resolver necesidades estéticas.

---

## Síntomas cuando se rompe

- Componentes con demasiada lógica de negocio.
- Reglas clínicas duplicadas.
- Diferencias de comportamiento entre pantallas.
- Acceso directo a persistencia desde la UI.
- Dificultad para modificar componentes sin afectar funcionalidades.
- Errores que aparecen únicamente en determinadas pantallas.

---

## Diagnóstico

Ante un cambio visual que aparentemente requiere modificar dominio, persistencia o reglas clínicas:

1. Verificar si el dato ya está disponible mediante un servicio o hook.
2. Verificar si existe un componente reutilizable.
3. Verificar si la necesidad puede resolverse mediante `src/theme`.
4. Verificar si existe lógica duplicada en la UI.
5. Modificar capas inferiores únicamente si existe una necesidad funcional real.

---

## Documentos relacionados

- `00_PROJECT_MASTER_CONTEXT.md`
- `01_ARCHITECTURE.md`
- `02_ROADMAP.md`
- `14_VISUAL_REDESIGN_V2.md`

---

# ADR-008

## Título

La navegación principal de CardioSync utiliza cuatro destinos funcionales

---

## Fecha

2026-08-22

---

## Estado

Activa

---

## Contexto

El Rediseño Visual V2 reorganizó la navegación principal para reducir la cantidad de destinos visibles y separar las funciones principales de las secundarias.

---

## Decisión

La navegación inferior definitiva será:

`Inicio | Registros | Perfil | Más`

Las funciones secundarias, incluyendo Estadísticas, Reportes y Configuración, se accederán desde `Más`.

La acción principal de creación de una medición se representa mediante un FAB reutilizado en Inicio y Registros.

---

## Justificación

La navegación distingue entre:

- funciones principales de uso frecuente;
- funciones secundarias;
- acciones contextuales.

Esto reduce la saturación de la navegación inferior y mantiene una jerarquía clara.

---

## Consecuencias

Las pantallas nuevas deberán respetar esta organización.

No deberán agregarse destinos permanentes a la barra inferior sin revisar previamente esta decisión.

---

## Documentos relacionados

- `14_VISUAL_REDESIGN_V2.md`
- `02_ROADMAP.md`

---

# ADR-009

## Título

Health Connect pertenece a Configuración y no al Perfil

---

## Fecha

2026-08-22

---

## Estado

Activa

---

## Contexto

Health Connect representa una integración externa de CardioSync.

El Perfil representa información del usuario y su contexto clínico.

---

## Decisión

La administración de Health Connect pertenece a:

`Más → Configuración → Health Connect`

El Perfil podrá mostrar información proveniente de integraciones externas cuando corresponda, pero no administra la conexión, permisos ni sincronización.

---

## Justificación

La decisión mantiene separadas:

- información del usuario;
- configuración de la aplicación;
- integraciones externas.

Esto evita convertir el Perfil en un contenedor de configuraciones técnicas.

---

## Consecuencias

Las futuras funcionalidades de Health Connect deberán mantener su configuración dentro de Configuración.

---

## Documentos relacionados

- `14_VISUAL_REDESIGN_V2.md`
- `04_CLINICAL_DOMAIN.md`
- documentación de Health Connect
