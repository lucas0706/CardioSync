# Documentación de CardioSync

Esta documentación explica qué hace CardioSync, cómo se utiliza, cómo está construida y cómo se mantiene. Está organizada para que una persona que llega por primera vez pueda empezar por el producto y profundizar después en su implementación.

## Empezar aquí

- [Descripción del producto](00_PRODUCT_OVERVIEW.md): propósito, funcionalidades y recorrido general.
- [Guía de uso](15_USER_GUIDE.md): navegación y operaciones disponibles en la aplicación.
- [Arquitectura](01_ARCHITECTURE.md): organización del código, capas y dependencias.
- [Estructura de carpetas](12_FOLDER_STRUCTURE.md): mapa del repositorio.
- [Desarrollo y ejecución](17_DEVELOPMENT_WORKFLOW.md): entorno de desarrollo y comprobaciones habituales.

## Guías para lectores

- [Guía para profesionales de la salud](20_MEDICAL_PROFESSIONAL_GUIDE.md): cómo interpretar los registros, la clasificación y las estadísticas, con sus límites conocidos.

## Funcionalidades

| Área | Descripción |
|---|---|
| [Dominio clínico](04_CLINICAL_DOMAIN.md) | Modelos de contexto del paciente y conceptos clínicos usados por la aplicación. |
| [Motor de reglas clínicas](05_CLINICAL_RULE_ENGINE.md) | Cómo se ejecutan las reglas y cómo producen hallazgos. |
| [Análisis clínico](06_CLINICAL_ANALYSIS.md) | Composición y resultado de un análisis. |
| [Reportes](07_REPORTS.md) | Construcción, vista previa y generación de reportes. |
| [Health Connect](08_HEALTH_CONNECT.md) | Integración con datos de salud de Android. |
| [Base de datos e importación](09_DATABASE.md) | Persistencia, formatos de intercambio y acceso a datos. |
| [Copias y recuperación](16_BACKUP_AND_RESTORE.md) | Copias locales, Google Drive, programación y restauración. |
| [Actualizaciones y distribución](14_RELEASES_AND_UPDATES.md) | APK de producción, canales y actualizaciones OTA. |

## Arquitectura y decisiones

- [Arquitectura](01_ARCHITECTURE.md)
- [Módulos](11_MODULES.md)
- [Estructura de carpetas](12_FOLDER_STRUCTURE.md)
- [Decisiones arquitectónicas](03_DECISIONS.md)
- [Roadmap](02_ROADMAP.md)

## Mantenimiento del proyecto

- [Flujo de desarrollo y validación](17_DEVELOPMENT_WORKFLOW.md)
- [Historial de cambios](10_CHANGELOG.md)
- [Normas para contribuir a la documentación](99_DOCUMENTATION_GUIDELINES.md)

## Documentación clínica

La carpeta [clinical/](clinical/) reúne la descripción del dominio, las guías de referencia y las extracciones de sus fuentes. La documentación distingue entre lo que indica una fuente clínica y la lógica implementada por CardioSync.

## Registros internos de mantenimiento

Los siguientes documentos sirven para organizar el trabajo interno de documentación; no son la explicación principal de cómo funciona el producto:

- [Auditoría documental de octubre de 2026](00_DOCUMENTATION_AUDIT_2026-10-15.md).
- [Brechas documentales y plan de resolución](18_DOCUMENTATION_GAPS.md).

Los archivos de checkpoints y los documentos históricos describen estados de desarrollo concretos. Para conocer el comportamiento actual de una función, se debe priorizar su documentación funcional y el código correspondiente.
