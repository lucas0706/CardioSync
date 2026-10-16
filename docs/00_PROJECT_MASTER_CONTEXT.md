# CardioSync — contexto general del proyecto

Este documento reúne la visión del producto, las decisiones técnicas que orientan su desarrollo y los enlaces para profundizar en cada parte. Para una introducción funcional, consultar primero la [descripción del producto](00_PRODUCT_OVERVIEW.md) y la [guía de uso](15_USER_GUIDE.md).

## 1. Propósito del producto

CardioSync es una aplicación Android para registrar y seguir mediciones de presión arterial. Permite consultar el historial, observar estadísticas y gráficos, generar reportes y proteger la información mediante copias de seguridad. También incorpora funciones de perfil, importación de datos, integración con Health Connect y gestión de actualizaciones.

La aplicación es una herramienta de seguimiento personal. Sus clasificaciones, estadísticas y reportes no sustituyen el diagnóstico ni la valoración de un profesional de salud.

## 2. Funcionalidades del proyecto

El código de la rama de referencia organiza las principales capacidades en estas áreas:

- **Mediciones:** registro, validación, consulta, edición y eliminación de mediciones.
- **Dashboard:** resumen de seguimiento y visualización de los registros.
- **Estadísticas:** promedios, tendencias, variabilidad y filtros por período.
- **Perfil:** información personal utilizada como contexto.
- **Dominio clínico:** modelos, guías, clasificación, objetivos y reglas clínicas.
- **Análisis clínico:** coordinación de reglas y construcción de hallazgos.
- **Reportes:** preparación de contenido, generación de PDF y gráfico de evolución.
- **Health Connect:** lectura de datos autorizados y sincronización de mediciones propias.
- **Backup:** copias locales, programación, Google Drive y restauración.
- **Importación:** procesamiento de archivos CSV y SQLite compatibles.
- **Actualizaciones:** pantallas y servicios relacionados con las actualizaciones de la aplicación.
- **Información de la app:** datos de versión y contenido de la sección Acerca de.

La existencia de código para una función describe su implementación en el repositorio; la disponibilidad final también depende de la configuración de la build, permisos y comportamiento del dispositivo.

## 3. Arquitectura

El código se organiza principalmente en cuatro áreas:

- `src/core`: infraestructura compartida, como base de datos y autenticación.
- `src/domain`: modelos, tipos, cálculos y reglas del negocio.
- `src/features`: capacidades funcionales con sus pantallas, servicios, modelos y utilidades.
- `src/components`: componentes visuales reutilizables.

También existen directorios compartidos para hooks, servicios, estado, tema, tipos y utilidades, además de herramientas de desarrollo y una estructura clínica adicional que convive con `src/domain/clinical`.

La separación busca mantener las reglas del negocio fuera de las pantallas, evitar consultas SQLite desde la UI y encapsular las integraciones externas. Antes de mover o duplicar lógica clínica, identificar qué implementación utiliza cada flujo.

Más información:
- [Arquitectura](01_ARCHITECTURE.md)
- [Módulos](11_MODULES.md)
- [Estructura de carpetas](12_FOLDER_STRUCTURE.md)

## 4. Dominio clínico

La medición y el contexto del paciente son conceptos distintos. `BloodPressureRecord` representa el registro de presión arterial; `ClinicalContext` reúne información del paciente que puede influir en la interpretación.

El servicio `ClinicalAnalysisDomainService` coordina reglas clínicas, reúne hallazgos y construye el resultado del análisis. Las estadísticas se calculan fuera de este servicio y se entregan como entrada.

La guía argentina de hipertensión de 2025 está registrada como guía predeterminada del análisis cuando no se proporciona otra. La existencia de una guía incorporada no significa que todas sus recomendaciones estén implementadas.

Documentos relacionados:
- [Dominio clínico](04_CLINICAL_DOMAIN.md)
- [Motor de reglas](05_CLINICAL_RULE_ENGINE.md)
- [Análisis clínico](06_CLINICAL_ANALYSIS.md)
- [Fuentes y guías clínicas](clinical/)

## 5. Tecnologías principales

| Área | Tecnología |
|---|---|
| Lenguaje | TypeScript |
| Framework de aplicación | React Native |
| Plataforma | Expo |
| Navegación | Expo Router |
| Persistencia local | SQLite mediante `expo-sqlite` |
| Formularios | React Hook Form |
| Validación de formularios | Zod |
| Distribución Android | EAS Build / APK |
| Actualizaciones compatibles | Expo Updates, según runtime y configuración |

Las versiones concretas de Expo SDK, React Native y dependencias deben obtenerse de los archivos de configuración del commit que se esté desarrollando; no deben asumirse a partir de esta tabla.

## 6. Principios de desarrollo

1. Mantener TypeScript en modo estricto.
2. Respetar la separación entre UI, dominio, persistencia e integraciones.
3. Evitar que los componentes visuales implementen reglas clínicas o consultas de base de datos.
4. Evaluar compatibilidad, mantenimiento y necesidad antes de incorporar dependencias.
5. Mantener las fuentes clínicas y las reglas implementadas identificables por separado.
6. Resolver errores de compilación antes de agregar nuevas funcionalidades.
7. Documentar los cambios de arquitectura y mantener los documentos vinculados actualizados.
8. Validar las operaciones que pueden afectar datos de salud, especialmente restauraciones, borrados y sincronizaciones.

## 7. Distribución y actualizaciones

CardioSync contempla builds de Android y actualizaciones OTA para cambios compatibles con el runtime instalado. Una OTA no sustituye una build cuando cambian dependencias nativas, plugins, configuración nativa, runtime o código Kotlin/Java.

Antes de publicar, comprobar la rama y el commit, el estado de Git, la versión, el runtime efectivo y el perfil de build. La guía operativa está en [Versiones, actualizaciones y distribución](14_RELEASES_AND_UPDATES.md).

## 8. Documentación de referencia

| Necesidad | Documento |
|---|---|
| Entender el producto | [Descripción funcional](00_PRODUCT_OVERVIEW.md) |
| Usar las pantallas | [Guía de usuario](15_USER_GUIDE.md) |
| Entender las capas | [Arquitectura](01_ARCHITECTURE.md) |
| Registrar y consultar mediciones | [Módulos](11_MODULES.md) |
| Comprender el análisis clínico | [Dominio clínico](04_CLINICAL_DOMAIN.md), [reglas](05_CLINICAL_RULE_ENGINE.md), [análisis](06_CLINICAL_ANALYSIS.md) |
| Generar reportes | [Reportes](07_REPORTS.md) |
| Consultar datos externos | [Health Connect](08_HEALTH_CONNECT.md) |
| Importar y persistir datos | [Base de datos e importación](09_DATABASE.md) |
| Crear o restaurar copias | [Copias y recuperación](16_BACKUP_AND_RESTORE.md) |
| Publicar una versión | [Actualizaciones y distribución](14_RELEASES_AND_UPDATES.md) |
| Preparar el entorno | [Flujo de desarrollo](17_DEVELOPMENT_WORKFLOW.md) |
| Consultar cambios | [Changelog](10_CHANGELOG.md) |

Los registros de auditoría y brechas documentales se conservan como material interno de mantenimiento. Para entender una funcionalidad, empezar por su guía funcional o técnica y luego consultar el código enlazado.