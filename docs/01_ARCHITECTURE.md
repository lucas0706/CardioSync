# CardioSync — Arquitectura

| Campo | Valor |
|---|---|
| Documento | `01_ARCHITECTURE.md` |
| Tipo | Especificación de arquitectura |
| Estado | Activo |
| Última revisión | 2026-10-17 |
| Alcance | Arquitectura observada y reglas de diseño |

## 1. Objetivo

Este documento describe la organización técnica de CardioSync, las responsabilidades principales y los límites que deben respetarse al modificar el sistema.

El documento distingue entre la estructura observada en el repositorio y los principios arquitectónicos que deben guiar su evolución. No sustituye al código ni afirma que todos los flujos estén validados en dispositivos.

## 2. Principios

CardioSync prioriza:

- Separación de responsabilidades.
- Bajo acoplamiento y alta cohesión.
- Dominio independiente de la interfaz.
- Persistencia encapsulada.
- Integraciones externas aisladas tras servicios específicos.
- Reutilización sin crear abstracciones innecesarias.
- TypeScript strict.
- Compatibilidad verificada con Expo SDK 57.
- Documentación sincronizada con la implementación.
- Cambios incrementales, revisables y verificables.

## 3. Estructura observada del repositorio

La carpeta `src/` contiene las siguientes áreas principales:

| Ruta | Responsabilidad arquitectónica |
|---|---|
| `src/core` | Infraestructura compartida; actualmente incluye áreas como base de datos y autenticación. |
| `src/domain` | Modelos y lógica del dominio, incluyendo mediciones, estadísticas, salud y dominio clínico. |
| `src/features` | Flujos funcionales organizados por área, por ejemplo mediciones, estadísticas, reportes, Health Connect, copias de seguridad y actualizaciones. |
| `src/components` | Componentes reutilizables de presentación. |
| `src/clinical` | Código clínico compartido que debe revisarse junto con `src/domain/clinical` para evitar duplicación de reglas. |
| `src/devtools` | Herramientas de desarrollo. Su inclusión en rutas de producción debe controlarse explícitamente. |
| `src/hooks` | Hooks compartidos. |
| `src/services` | Servicios compartidos o de compatibilidad que no deben duplicar la responsabilidad de las features. |
| `src/store` | Estado compartido de la aplicación. |
| `src/theme` | Tokens y configuración visual. |
| `src/types` | Tipos compartidos cuando no pertenecen claramente a un dominio concreto. |
| `src/utils` | Utilidades genéricas sin lógica de negocio específica. |

La estructura principal acordada para la evolución sigue siendo `src/core`, `src/domain`, `src/features` y `src/components`. Las demás carpetas existentes se mantienen por compatibilidad con el código actual y no deben reorganizarse de forma masiva sin una propuesta específica.

## 4. Navegación y entornos

CardioSync utiliza Expo Router. El archivo `app.config.js` selecciona la raíz de rutas entre `app` y `app-production`, utilizando la configuración de entorno/build correspondiente.

La separación entre producción y herramientas de desarrollo es una frontera importante:

- Las rutas de producción no deben exponer herramientas exclusivas de desarrollo.
- Los cambios de navegación deben comprobarse tanto en el árbol correspondiente a producción como en el entorno de desarrollo.
- No se debe asumir qué raíz se está utilizando solo por inspeccionar una carpeta; debe revisarse la configuración efectiva.

## 5. Responsabilidades por capa

### Presentación

Incluye pantallas, componentes y elementos visuales.

Debe:
- Presentar datos y estados.
- Recoger las acciones del usuario.
- Delegar cálculos y reglas a servicios o al dominio.
- Mostrar errores, permisos pendientes y estados vacíos de forma explícita.

No debe:
- Acceder directamente a SQLite.
- Duplicar clasificación o reglas clínicas.
- Implementar lógica de negocio que deba reutilizarse fuera de la pantalla.

### Features

Cada feature agrupa la interfaz y los servicios necesarios para un flujo funcional concreto. Ejemplos presentes en el repositorio incluyen `measurements`, `statistics`, `reports`, `healthConnect`, `backup` y `appUpdate`.

Las features pueden coordinar el flujo de usuario, pero no deben convertirse en una segunda implementación del dominio.

### Domain

Contiene los conceptos y reglas de negocio que deben poder entenderse sin depender de componentes React.

Las estadísticas descriptivas deben permanecer separadas de la interpretación clínica. Los tipos compartidos deben ubicarse según su responsabilidad real, evitando dependencias circulares entre features.

### Core e infraestructura

Contiene capacidades transversales, como la inicialización y el acceso a la base de datos y los mecanismos comunes de autenticación.

La infraestructura no debe absorber reglas clínicas ni decisiones propias de una pantalla. Los cambios de infraestructura deben evaluarse por su impacto en todas las features consumidoras.

### Servicios de integración

Los servicios que conectan CardioSync con Android, Health Connect, Google Drive, GitHub Releases, Expo Updates u otros sistemas deben encapsular sus APIs y traducir errores externos a resultados manejables por la aplicación.

Los permisos, la conectividad, los datos ausentes y las restricciones del sistema operativo son resultados posibles, no excepciones que deban ocultarse.

## 6. Persistencia y base de datos

El proyecto utiliza Expo SQLite. El archivo de base de datos identificado en el servicio inspeccionado es `cardiosync.db`.

Reglas:

- La interfaz no debe ejecutar SQL directamente.
- Las operaciones de persistencia deben pasar por la capa de acceso a datos/repositories existente.
- Las migraciones deben ser explícitas, ordenadas y seguras para datos existentes.
- Los errores de escritura, lectura y migración deben manejarse sin informar éxito prematuramente.
- Los flujos de backup y restauración deben coordinarse con la base de datos y proteger frente a sobrescrituras accidentales.
- Todo cambio de esquema requiere revisar su compatibilidad con copias de seguridad y versiones instaladas.

Antes de introducir una nueva abstracción de repositorio, debe auditarse el patrón real del módulo afectado y reutilizarse si resulta adecuado.

## 7. Dominio clínico

El dominio clínico contiene responsabilidades de clasificación, contexto, reglas, análisis y resultados clínicos. La fuente clínica activa documentada es el Consenso Argentino de Hipertensión Arterial 2025.

Principios obligatorios:

- La UI consume resultados del dominio y no vuelve a implementar sus reglas.
- Las estadísticas descriptivas no emiten recomendaciones clínicas.
- Toda regla clínica debe ser trazable a una fuente y a un criterio documentado.
- Deben distinguirse resultados calculados, información faltante y advertencias.
- Los cambios de clasificación requieren revisar documentación, pruebas y todas las pantallas consumidoras.
- Una regla implementada no implica que la totalidad de una guía esté cubierta ni que el sistema esté clínicamente validado.

La carpeta `src/clinical` y `src/domain/clinical` deben inspeccionarse conjuntamente antes de mover o consolidar código clínico.

## 8. Integraciones y operaciones del sistema

### Health Connect

La feature de Health Connect debe gestionar permisos, tipos de datos disponibles, errores de acceso y ausencia de registros. La disponibilidad de datos depende del dispositivo, las aplicaciones proveedoras y los permisos del usuario.

### Copias de seguridad

El repositorio contiene servicios para copia manual, tareas programadas y Google Drive. Estas rutas tienen condiciones de ejecución diferentes y no deben documentarse como una garantía de respaldo exitoso sin comprobar el resultado real.

La restauración requiere una revisión específica de integridad, compatibilidad y recuperación ante fallos.

### Actualizaciones OTA y APK

La aplicación contiene servicios diferenciados para Expo Updates y para consultar/descargar APK desde GitHub Releases.

- OTA solo debe utilizarse para cambios compatibles con el runtime instalado.
- Cambios en Expo SDK, plugins, dependencias nativas, manifiesto, código Kotlin/Java o runtime pueden requerir una nueva APK.
- La descarga de una APK y la instalación son pasos distintos.
- La instalación depende del instalador y de las autorizaciones de Android.
- Los cambios que afecten compatibilidad deben seguir el proceso de build de producción.

Antes de publicar una OTA se debe verificar el estado de Git, el commit, el runtime efectivo y el channel, y confirmar que no se introdujeron cambios nativos incompatibles.

## 9. TypeScript, dependencias y compatibilidad

- El código nuevo debe mantener TypeScript strict y evitar `any` innecesario.
- La comprobación disponible es `npm run typecheck`.
- Antes de agregar o actualizar dependencias debe evaluarse su compatibilidad con Expo SDK 57, React Native instalado, soporte nativo, mantenimiento y costo de build.
- No se debe actualizar una biblioteca por intuición ni asumir que una versión compatible con otra versión de Expo también lo es con SDK 57.
- Los cambios nativos requieren validar configuración de Expo y el resultado de una Development Build o build de producción según el alcance.

## 10. Flujo de cambios

Para cada modificación arquitectónica:

1. Auditar los archivos y consumidores relacionados.
2. Identificar el comportamiento actual y el objetivo.
3. Evaluar impacto en persistencia, datos de salud, navegación y módulos nativos.
4. Implementar el cambio mínimo coherente.
5. Ejecutar las comprobaciones aplicables y documentar las que no se ejecutaron.
6. Revisar el diff y confirmar el alcance.
7. Actualizar la documentación específica y el roadmap/changelog si corresponde.
8. Abrir un Pull Request independiente para revisión.

No se debe fusionar un PR ni publicar una OTA o APK sin autorización explícita.

## 11. Criterios de aceptación

Una modificación arquitectónica se considera lista para revisión cuando:

- Respeta los límites de responsabilidad descritos.
- No introduce dependencias ni duplicación injustificada.
- Conserva los datos existentes o documenta una migración segura.
- Mantiene compatibilidad con Expo SDK 57 o identifica claramente el cambio de build requerido.
- Supera las comprobaciones ejecutadas aplicables.
- Documenta las limitaciones y pruebas pendientes.
- Contiene solo los archivos necesarios para el alcance del PR.

## 12. Documentos relacionados

- `00_PROJECT_MASTER_CONTEXT.md`: contexto maestro y estado conocido.
- `02_ROADMAP.md`: fases del proyecto.
- `03_DECISIONS.md`: decisiones arquitectónicas y su justificación.
- `04_CLINICAL_DOMAIN.md`: dominio clínico.
- `05_CLINICAL_RULE_ENGINE.md`: reglas clínicas.
- `06_CLINICAL_ANALYSIS.md`: análisis clínico.
- `07_REPORTS.md`: reportes.
- `08_HEALTH_CONNECT.md`: integración Health Connect.
- `09_DATABASE.md`: persistencia y base de datos.
- `10_CHANGELOG.md`: historial de cambios.
- `11_MODULES.md`: inventario de módulos.

## 13. Regla final

La arquitectura debe evolucionar a partir del código real, no de diagramas desactualizados. Cuando una responsabilidad no esté clara, se auditan sus consumidores y dependencias antes de moverla. La prioridad es la estabilidad, la integridad de los datos de salud y la mantenibilidad a largo plazo.
