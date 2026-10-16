# Módulos de CardioSync

CardioSync organiza el código por capacidades funcionales, modelos de dominio, servicios compartidos y componentes visuales. Esta separación ayuda a localizar la lógica y evita que las pantallas concentren toda la implementación.

## Módulos funcionales

### Measurements — mediciones

Ubicación: `src/features/measurements` y `src/domain/measurements`.

Gestiona los flujos de registro, consulta y edición de mediciones de presión arterial, además de sus modelos, validaciones, mappers y servicios de la funcionalidad.

### Dashboard — inicio y resumen

Ubicación: `src/features/dashboard` y `src/domain/dashboard`.

Prepara y presenta resúmenes de seguimiento y visualizaciones para la pantalla de inicio. Los componentes gráficos compartidos se encuentran en `src/components/charts`.

### Statistics — estadísticas

Ubicación: `src/features/statistics` y `src/domain/statistics`.

Organiza las pantallas y servicios de estadísticas y concentra en el dominio los cálculos, filtros, modelos y utilidades que describen los datos registrados.

### Profile — perfil

Ubicación: `src/features/profile`.

Contiene las pantallas, hooks y servicios relacionados con los datos del perfil que utiliza la aplicación como información contextual.

### Reports — reportes

Ubicación: `src/features/reports`.

Prepara el contenido de reportes y la generación de documentos, incluidos el gráfico SVG/HTML que se incorpora al PDF y los flujos para compartir o imprimir.

### Health Connect

Ubicación: `src/features/healthConnect`.

Contiene la integración con Android Health Connect: configuración, permisos, lectura de registros, mapeo de datos y sincronización de mediciones propias.

### Backup — copias y restauración

Ubicación: `src/features/backup`.

Contiene servicios y tareas relacionados con copias de seguridad, copias programadas, acceso a Google Drive y validación/restauración de bases compatibles.

### Import — importación

Ubicación: `src/features/import`.

Contiene pantallas, parsers, modelos y servicios para procesar archivos compatibles e incorporar mediciones al modelo interno.

### App updates — actualizaciones

Ubicación: `src/features/appUpdate` y `src/features/updates`.

Agrupa pantallas, hooks, servicios y componentes relacionados con la comprobación y gestión de actualizaciones de la aplicación.

### About — información de la aplicación

Ubicación: `src/features/about`.

Contiene la información de versión, datos de presentación y pantallas de información de CardioSync.

### Splash

Ubicación: `src/features/splash`.

Contiene los componentes y pantallas asociados a la presentación inicial de la aplicación.

## Capas compartidas

### Dominio

`src/domain` contiene modelos y lógica de negocio organizados por área, incluidos mediciones, estadísticas, dashboard y análisis clínico.

### Core

`src/core` contiene infraestructura compartida, como la configuración de la base de datos y autenticación cuando corresponde.

### Componentes

`src/components` contiene componentes de interfaz reutilizables, incluidos formularios, elementos UI y gráficos.

### Servicios, hooks y estado compartido

- `src/services`: servicios compartidos que no están encapsulados en una feature.
- `src/hooks`: hooks reutilizables.
- `src/store`: estado compartido de la aplicación.
- `src/theme`: tokens y configuración visual.
- `src/types`: tipos compartidos.
- `src/utils`: utilidades comunes.

### Clinical legacy y herramientas de desarrollo

- `src/clinical` contiene una organización clínica adicional que convive con `src/domain/clinical`; al modificar lógica clínica, hay que comprobar qué implementación consume cada flujo antes de mover o duplicar código.
- `src/devtools` reúne herramientas y escenarios de desarrollo. No debe asumirse que un escenario de desarrollo sea una fuente de datos de producción.

## Cómo se relacionan

```text
Pantallas y componentes
        ↓
Servicios y mappers de cada feature
        ↓
Dominio y reglas de negocio
        ↓
Persistencia e integraciones externas
```

El recorrido exacto depende de la funcionalidad. No todas las features utilizan todas las capas, y las integraciones externas deben mantenerse separadas del modelo propio de mediciones.

## Guías relacionadas

- [Arquitectura](01_ARCHITECTURE.md)
- [Estructura de carpetas](12_FOLDER_STRUCTURE.md)
- [Dominio clínico](04_CLINICAL_DOMAIN.md)
- [Base de datos e importación](09_DATABASE.md)