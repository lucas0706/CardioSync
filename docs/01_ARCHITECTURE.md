# Arquitectura de CardioSync

CardioSync es una aplicación Android construida con Expo y React Native, organizada en módulos de funcionalidades y capas compartidas. La arquitectura busca separar la interfaz, las reglas del dominio y los servicios de infraestructura para que cada parte pueda evolucionar sin concentrar toda la lógica en las pantallas.

## 1. Vista general

El código se organiza principalmente en estas áreas:

| Directorio | Responsabilidad |
|---|---|
| `src/features` | Pantallas, hooks y servicios que coordinan funcionalidades visibles, como perfil, reportes y Health Connect. |
| `src/domain` | Modelos y lógica del dominio: mediciones, estadísticas y análisis clínico. |
| `src/core` | Infraestructura compartida, persistencia y acceso a servicios del sistema. |
| `src/components` | Componentes de presentación reutilizables. |

El repositorio también contiene módulos heredados y utilidades compartidas. Su presencia no implica que todos tengan el mismo papel arquitectónico; cuando una funcionalidad se modifica, se debe seguir el flujo real de imports y consumidores del módulo involucrado.

## 2. Cómo fluye la información

Un flujo típico de registro y análisis sigue este recorrido:

1. Una pantalla de una feature recoge la acción y los datos ingresados.
2. La feature delega la operación al servicio correspondiente.
3. Los servicios de persistencia acceden a SQLite mediante repositorios.
4. El dominio procesa los registros y, cuando corresponde, calcula estadísticas o interpreta resultados clínicos.
5. La feature presenta los datos y resultados en la interfaz.

La dirección exacta depende de la operación. La interfaz no debe convertirse en el lugar donde se implementan reglas de negocio o consultas directas a la base de datos.

## 3. Capas y responsabilidades

### Features

Cada feature agrupa el código que coordina una función de la aplicación: pantallas, hooks, servicios y modelos propios de presentación cuando corresponda. Por ejemplo, el perfil administra el contexto personal y reportes coordina la selección del período y la generación del documento.

Las features pueden consumir servicios del dominio y de infraestructura, pero no deben duplicar sus reglas.

### Domain

El dominio representa conceptos y comportamientos propios de CardioSync, sin depender de componentes visuales. Entre sus áreas se encuentran:

- **Measurements:** registros de presión arterial y sus datos asociados.
- **Statistics:** cálculos derivados de los registros.
- **Clinical:** reglas y hallazgos que interpretan información disponible según la guía configurada.
- **Guidelines y targets:** metadatos de guías clínicas y objetivos terapéuticos usados por las reglas.

Los cálculos estadísticos y la interpretación clínica tienen responsabilidades diferentes: las estadísticas describen los registros; las reglas clínicas evalúan esa información en un contexto determinado.

### Core

`src/core` concentra infraestructura reutilizable, incluyendo acceso a persistencia y servicios compartidos. El acceso a SQLite debe realizarse a través de los repositorios y adaptadores definidos por el proyecto, en lugar de abrir conexiones desde componentes de interfaz.

### Components

`src/components` contiene elementos visuales reutilizables. Los componentes reciben datos y callbacks y no deben convertirse en propietarios de reglas clínicas, lógica de persistencia ni coordinación de integraciones externas.

## 4. Dominio clínico

El análisis clínico se organiza mediante modelos, reglas y servicios:

- `ClinicalContext` representa información del perfil que puede influir en la interpretación.
- `ClinicalRuleContext` aporta la guía seleccionada y la fecha de evaluación a las reglas.
- Cada regla implementa el contrato `ClinicalRule` y devuelve cero o más `ClinicalFinding`.
- `ClinicalAnalysisDomainService` compone las reglas y reúne los hallazgos en un `ClinicalAnalysis`.
- `ClinicalTargetSelector` selecciona objetivos terapéuticos definidos para una guía.

La implementación actual incluye clasificación de presión arterial, advertencias de seguridad, tendencias, carga de hipertensión, tiempo en objetivo, variabilidad, control domiciliario, objetivos terapéuticos y factores asociados al riesgo cardiovascular. La descripción de cada regla y su fuente se mantiene en la documentación clínica específica.

## 5. Persistencia y fuentes externas

Los registros de CardioSync se guardan localmente mediante SQLite y repositorios. Las integraciones externas se coordinan desde sus servicios específicos; por ejemplo, Health Connect tiene su propio flujo de permisos y acceso a datos.

Las fuentes externas no deben acoplarse directamente a los modelos de medición propios ni obligar a que el flujo principal de registro dependa de una integración opcional.

Las copias de seguridad, la restauración y la importación son operaciones diferentes y se documentan por separado en [Base de datos e importación](09_DATABASE.md) y [Copias y recuperación](16_BACKUP_AND_RESTORE.md).

## 6. Reglas de diseño

- Mantener las responsabilidades de UI, dominio e infraestructura separadas.
- Evitar consultas SQL directas desde pantallas y componentes.
- Reutilizar servicios existentes antes de crear otra vía para la misma operación.
- Mantener la lógica clínica separada de los cálculos estadísticos.
- No inferir datos clínicos que no estén disponibles en el contexto.
- Mantener la trazabilidad entre una regla clínica y su guía de referencia.
- Evitar dependencias nuevas sin justificar su necesidad y compatibilidad con la versión de Expo usada por el proyecto.
- Mantener TypeScript en modo estricto y respetar la estructura modular existente.

## 7. Dónde encontrar más información

- [Mapa de módulos](11_MODULES.md)
- [Estructura de carpetas](12_FOLDER_STRUCTURE.md)
- [Dominio clínico](04_CLINICAL_DOMAIN.md)
- [Motor de reglas clínicas](05_CLINICAL_RULE_ENGINE.md)
- [Análisis clínico](06_CLINICAL_ANALYSIS.md)
- [Base de datos e importación](09_DATABASE.md)
- [Flujo de desarrollo](17_DEVELOPMENT_WORKFLOW.md)
