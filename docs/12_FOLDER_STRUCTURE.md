# Estructura de carpetas

Este documento explica dónde se encuentra cada tipo de código dentro del repositorio CardioSync y cómo navegarlo al desarrollar o mantener una funcionalidad.

## Raíz del repositorio

- `app/`: rutas y pantallas de navegación utilizadas por la configuración de desarrollo.
- `app-production/`: rutas de producción separadas para la configuración de compilación que utiliza esa raíz.
- `src/`: implementación modular de la aplicación.
- `docs/`: documentación funcional y técnica.
- `assets/`: recursos gráficos y otros recursos estáticos.
- `plugins/`: plugins de configuración nativa de Expo.
- `package.json`, `app.json`, `app.config.js`, `eas.json`: dependencias y configuración de Expo/EAS.

Las raíces de rutas y el perfil de build activo dependen de la configuración de Expo/EAS de la rama y del perfil utilizado.

## Directorios principales de `src/`

### `src/core`

Infraestructura central compartida. Incluye, entre otros, el acceso y la configuración de la base de datos y los módulos de autenticación.

### `src/domain`

Modelos, tipos y reglas del dominio, organizados por área:

- `clinical/`: contexto, modelos, guías, reglas y servicios de análisis clínico.
- `measurements/`: entidades y tipos de mediciones.
- `statistics/`: cálculos, filtros, modelos y servicios estadísticos.
- `dashboard/` y `health/`: modelos relacionados con esas áreas.

### `src/features`

Funcionalidades organizadas por capacidad. Entre los directorios principales se encuentran:

- `about/`
- `appUpdate/` y `updates/`
- `backup/`
- `dashboard/`
- `healthConnect/`
- `import/`
- `measurements/`
- `profile/`
- `reports/`
- `splash/`
- `statistics/`

Cada feature puede contener pantallas, componentes, hooks, modelos, parsers, mappers, servicios, tipos y validaciones según sus necesidades.

### `src/components`

Componentes visuales compartidos. Incluye componentes UI, formularios y gráficos reutilizables. Los gráficos clínicos se organizan en `src/components/charts`.

### Otros directorios de `src/`

- `src/hooks`: hooks reutilizables.
- `src/services`: servicios compartidos.
- `src/store`: estado compartido.
- `src/theme`: configuración y tokens visuales.
- `src/types`: tipos compartidos.
- `src/utils`: funciones auxiliares.
- `src/clinical`: estructura clínica adicional que convive con el dominio clínico; antes de modificarla, identificar qué código la consume.
- `src/devtools`: herramientas y escenarios de desarrollo, incluidos recursos para gráficos, clínica, Health Connect, reportes y estadísticas.

## Cómo localizar una funcionalidad

| Si necesitás cambiar… | Empezá por… |
|---|---|
| Registro o edición de mediciones | `src/features/measurements` |
| Entidad o reglas de medición | `src/domain/measurements` |
| Inicio y resumen | `src/features/dashboard` |
| Cálculos estadísticos | `src/domain/statistics` |
| Pantallas de estadísticas | `src/features/statistics` |
| Reglas o modelos clínicos | `src/domain/clinical` y sus consumidores |
| Reportes PDF | `src/features/reports` |
| Health Connect | `src/features/healthConnect` |
| Copias y restauración | `src/features/backup` |
| Importación de archivos | `src/features/import` |
| Perfil | `src/features/profile` |
| Actualizaciones | `src/features/appUpdate` y `src/features/updates` |
| Componentes de interfaz compartidos | `src/components` |
| Configuración de base de datos | `src/core/database` |

## Principios para mantener la estructura

1. Ubicar cada cambio junto a la responsabilidad que modifica.
2. Mantener modelos y reglas del negocio fuera de los componentes visuales.
3. Evitar que la UI ejecute consultas SQLite directamente.
4. Mantener las integraciones externas dentro de su módulo y mapear sus datos antes de utilizarlos en el dominio.
5. Si una funcionalidad cruza varias capas, documentar el flujo y actualizar [Arquitectura](01_ARCHITECTURE.md).

La estructura evoluciona con el proyecto; al agregar o mover módulos, actualizar esta guía y la referencia de [módulos](11_MODULES.md).