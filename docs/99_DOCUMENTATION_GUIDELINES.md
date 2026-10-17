
# CardioSync — Documentation Guidelines

| Campo | Valor |
|-------|--------|
| Documento | 99_DOCUMENTATION_GUIDELINES.md |
| Tipo | Normas de documentación |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-10-17 |

---

# Objetivo

Este documento define las reglas para crear, actualizar y mantener la documentación oficial de CardioSync.

La documentación forma parte del proyecto y debe evolucionar junto con el código.

---

# Principio general

Código y documentación deben mantenerse sincronizados.

Una funcionalidad no se considera finalizada hasta que:

- El código esté implementado.
- Las pruebas correspondientes estén realizadas.
- La arquitectura esté actualizada.
- La documentación esté revisada.

---

# Documentos obligatorios de actualización

Al finalizar una fase del proyecto se deberán revisar:

## 00_PROJECT_MASTER_CONTEXT.md

Actualizar:

- Estado general.
- Objetivos.
- Arquitectura global.

---

## 01_ARCHITECTURE.md

Actualizar:

- Cambios arquitectónicos.
- Nuevos módulos.
- Nuevas dependencias.

---

## 02_ROADMAP.md

Actualizar:

- Estado de la fase.
- Próximas etapas.
- Orden de desarrollo.

---

## 03_DECISIONS.md

Actualizar:

- Nuevas decisiones arquitectónicas.
- Cambios importantes.
- Decisiones reemplazadas.

---

## 10_CHANGELOG.md

Registrar:

- Fecha.
- Cambio realizado.
- Archivos afectados.
- Documentación relacionada.

---

# Estados permitidos

Toda funcionalidad deberá utilizar únicamente:

## ✅ COMPLETADO

Implementado, validado y documentado.

---

## 🚧 EN DESARROLLO

Actualmente en implementación.

---

## 📋 PLANIFICADO

Definido dentro del roadmap pero todavía no iniciado.

---

# Reglas de actualización

## Nuevas funcionalidades

Antes de implementarlas:

- Revisar arquitectura.
- Definir impacto.
- Actualizar roadmap si corresponde.

Después de implementarlas:

- Actualizar documentación.
- Registrar decisiones importantes.
- Actualizar changelog.

---

# Cambios arquitectónicos

Toda modificación que afecte:

- Capas.
- Dominios.
- Relaciones entre módulos.
- Persistencia.
- Integraciones externas.

deberá generar un registro en:

03_DECISIONS.md

---

# Nuevos módulos

Antes de crear un módulo:

Debe definirse:

- Responsabilidad.
- Dependencias.
- Límites.
- Relación con otros módulos.

Debe actualizarse:

- 01_ARCHITECTURE.md
- 11_MODULES.md
- 12_FOLDER_STRUCTURE.md

---

# Control de calidad documental

La documentación deberá evitar:

- Información duplicada.
- Contradicciones.
- Decisiones sin justificación.
- Estados incorrectos.
- Descripciones alejadas del código real.

---

# Revisión periódica

La documentación deberá revisarse cuando:

- Termine una fase del roadmap.
- Se realice una refactorización importante.
- Se agregue una integración externa.
- Cambie la arquitectura.

---

# Objetivo final

Mantener una documentación profesional que permita:

- Comprender CardioSync.
- Continuar el desarrollo sin perder contexto.
- Diagnosticar problemas arquitectónicos.
- Evolucionar el proyecto de forma segura.

---

# Reglas de mantenimiento — 2026-10-17

## Estados sin ambigüedad

Además de los estados del roadmap, la documentación puede usar **IMPLEMENTADO / VALIDACIÓN PENDIENTE** cuando exista código pero falten pruebas de integración o de dispositivo. No utilizar COMPLETADO como sinónimo de “hay un servicio o una pantalla”.

## Fuente de verdad

- Para comportamiento actual, inspeccionar el código de la rama base antes de describirlo.
- Diferenciar explícitamente hechos observados, decisiones de diseño, inferencias y trabajo futuro.
- No afirmar que una build, typecheck, prueba clínica o prueba en dispositivo pasó si no se ejecutó y no hay evidencia verificable para ese commit.
- Las validaciones históricas describen el commit en el que se realizaron; no certifican automáticamente commits posteriores.

## Cambios documentales por Pull Request

- Modificar un documento por PR cuando se trate de una actualización de la documentación principal.
- Cada PR debe indicar propósito, alcance, fuentes de verificación y validaciones no ejecutadas.
- Releer el archivo desde GitHub después del commit.
- No fusionar el PR sin revisión y autorización del responsable del proyecto.
- No recrear documentos eliminados deliberadamente.

## Compatibilidad y publicación

- Verificar compatibilidad con Expo SDK 57 antes de proponer cambios técnicos.
- Mantener TypeScript strict y la estructura arquitectónica vigente.
- Para OTA, comprobar estado Git, HEAD, runtime/channel efectivos y ausencia de cambios nativos.
- Los cambios en código nativo, plugins, dependencias nativas, Expo SDK o runtime requieren una APK de producción, no una OTA.
- Para Android, mantener una única política de runtime `appVersion`; comprobar que el runtime efectivo coincide con la versión de la aplicación.
- Antes de cada APK de producción, actualizar y validar `src/features/about/config/version-info.ts` y `src/features/about/config/appInfo.ts`, incluyendo versión, fecha, datos técnicos y novedades acumuladas desde la APK anterior, con las OTA relevantes del período.
- Mantener las novedades de Acerca de y las notas de GitHub Release coherentes con los cambios realmente publicados.
- Documentar la versión y el commit exactos de una publicación cuando se disponga de esos datos.

## Datos clínicos

Toda regla clínica nueva o modificada debe enlazar con fuentes clínicas identificables, conservar trazabilidad y distinguir resultados derivados de mediciones originales. La documentación no debe presentar la aplicación como sustituto de la evaluación profesional.
