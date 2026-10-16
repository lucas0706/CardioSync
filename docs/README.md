# Documentación de CardioSync

La documentación está organizada para explicar primero el producto y sus funciones, y después su arquitectura, implementación y operación.

## Empezar por la aplicación

- [Descripción funcional de CardioSync](00_PRODUCT_OVERVIEW.md): propósito, funcionalidades, recorrido de uso, datos y límites.
- [Guía de uso](15_USER_GUIDE.md): navegación, registro y edición de mediciones, reportes, perfil, copias, Health Connect y actualizaciones.
- [README del proyecto](../README.md): resumen del producto y puesta en marcha del entorno de desarrollo.
- [Contexto maestro](00_PROJECT_MASTER_CONTEXT.md): visión, objetivos y principios generales del proyecto.

## Funcionalidades y dominios

| Tema | Documento |
|---|---|
| Dominio clínico | [04_CLINICAL_DOMAIN.md](04_CLINICAL_DOMAIN.md) |
| Motor de reglas clínicas | [05_CLINICAL_RULE_ENGINE.md](05_CLINICAL_RULE_ENGINE.md) |
| Análisis clínico | [06_CLINICAL_ANALYSIS.md](06_CLINICAL_ANALYSIS.md) |
| Reportes | [07_REPORTS.md](07_REPORTS.md) |
| Health Connect | [08_HEALTH_CONNECT.md](08_HEALTH_CONNECT.md) |
| Base de datos, importación y persistencia | [09_DATABASE.md](09_DATABASE.md) |\n| Copias de seguridad y recuperación | [16_BACKUP_AND_RESTORE.md](16_BACKUP_AND_RESTORE.md) |
| Especificación de importación histórica | [13_IMPORTATION_SPECIFICATION.md](13_IMPORTATION_SPECIFICATION.md) |

## Arquitectura y desarrollo

- [Arquitectura](01_ARCHITECTURE.md): capas, responsabilidades y dependencias.
- [Módulos](11_MODULES.md): mapa de funcionalidades y responsabilidades.
- [Estructura de carpetas](12_FOLDER_STRUCTURE.md): organización del repositorio.
- [Flujo de desarrollo y validación](17_DEVELOPMENT_WORKFLOW.md): pasos de trabajo, comprobaciones, pruebas y cierre de tareas.
- [Decisiones arquitectónicas](03_DECISIONS.md): decisiones relevantes y sus motivos.
- [Roadmap](02_ROADMAP.md): evolución prevista y estado registrado.

## Distribución y mantenimiento

- [Versiones, actualizaciones y distribución Android](14_RELEASES_AND_UPDATES.md): configuración, OTA, APK y procedimiento de release.
- [Historial de cambios](10_CHANGELOG.md): cambios relevantes registrados.
- [Normas de documentación](99_DOCUMENTATION_GUIDELINES.md): cómo mantener esta documentación.

## Referencias clínicas e históricas

La carpeta [clinical/](clinical/) contiene documentación del dominio, glosario y referencias relacionadas con guías. Las fuentes clínicas deben conservar su procedencia y distinguirse de las reglas que realmente utiliza la aplicación.

Los documentos con prefijo CHECKPOINT y la carpeta [checkpoints/](checkpoints/) conservan estados históricos del desarrollo. Son referencias de contexto y no necesariamente describen el estado actual.

## Mantenimiento interno

La revisión documental inicial está registrada en [Auditoría documental de octubre de 2026](00_DOCUMENTATION_AUDIT_2026-10-15.md). Ese informe sirve para organizar el trabajo de documentación; no es la descripción principal del producto.

Los documentos deben distinguir entre diseño, código implementado y comportamiento validado. La presencia de código no demuestra por sí sola que todos los escenarios funcionen correctamente en producción.
