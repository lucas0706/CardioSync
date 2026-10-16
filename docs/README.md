# Documentación de CardioSync

Este directorio reúne la documentación técnica, funcional y clínica de CardioSync.

## Por dónde empezar

1. [README del proyecto](../README.md): propósito, funcionalidades y puesta en marcha.
2. [Contexto maestro](00_PROJECT_MASTER_CONTEXT.md): visión general del proyecto y principios.
3. [Arquitectura](01_ARCHITECTURE.md): organización técnica y responsabilidades.
4. [Roadmap](02_ROADMAP.md): estado y evolución prevista.
5. [Decisiones arquitectónicas](03_DECISIONS.md): decisiones y justificaciones registradas.
6. [Auditoría documental de octubre de 2026](00_DOCUMENTATION_AUDIT_2026-10-15.md): hallazgos, alcance y plan de saneamiento.

## Documentación técnica

| Tema | Documento |
|---|---|
| Dominio clínico | [04_CLINICAL_DOMAIN.md](04_CLINICAL_DOMAIN.md) |
| Motor de reglas clínicas | [05_CLINICAL_RULE_ENGINE.md](05_CLINICAL_RULE_ENGINE.md) |
| Análisis clínico | [06_CLINICAL_ANALYSIS.md](06_CLINICAL_ANALYSIS.md) |
| Reportes | [07_REPORTS.md](07_REPORTS.md) |
| Health Connect | [08_HEALTH_CONNECT.md](08_HEALTH_CONNECT.md) |
| Base de datos | [09_DATABASE.md](09_DATABASE.md) |
| Historial de cambios | [10_CHANGELOG.md](10_CHANGELOG.md) |
| Módulos | [11_MODULES.md](11_MODULES.md) |
| Estructura de carpetas | [12_FOLDER_STRUCTURE.md](12_FOLDER_STRUCTURE.md) |
| Importación histórica | [13_IMPORTATION_SPECIFICATION.md](13_IMPORTATION_SPECIFICATION.md) |
| Normas documentales | [99_DOCUMENTATION_GUIDELINES.md](99_DOCUMENTATION_GUIDELINES.md) |

## Documentación clínica

La carpeta [clinical/](clinical/) contiene especificaciones del dominio clínico, reglas, glosario y material relacionado con guías. Los documentos de fuentes y extracción deben conservar su procedencia y distinguirse de las reglas efectivamente implementadas.

## Checkpoints históricos

Los documentos con prefijos `CHECKPOINT` o ubicados en [checkpoints/](checkpoints/) registran estados puntuales del desarrollo. Son evidencia histórica y no deben interpretarse automáticamente como descripción del estado actual.

## Criterio de mantenimiento

- El código y la configuración vigentes describen la implementación.
- Las especificaciones explican el comportamiento esperado y sus límites.
- Las decisiones arquitectónicas registran el motivo de elecciones relevantes.
- Los checkpoints conservan el contexto histórico.
- El estado de una funcionalidad solo debe marcarse como verificado cuando exista evidencia suficiente; la presencia de archivos por sí sola no demuestra que el flujo funcione en producción.
