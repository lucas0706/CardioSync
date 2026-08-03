
# CardioSync — Documentation Guidelines

| Campo | Valor |
|-------|--------|
| Documento | 99_DOCUMENTATION_GUIDELINES.md |
| Tipo | Normas de documentación |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

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

