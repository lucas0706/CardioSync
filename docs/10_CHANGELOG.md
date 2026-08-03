# CardioSync — Changelog

| Campo | Valor |
|-------|--------|
| Documento | 10_CHANGELOG.md |
| Tipo | Historial de cambios del proyecto |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# Objetivo

Este documento registra los cambios importantes realizados en CardioSync.

Su finalidad es:

- Mantener historial del proyecto.
- Conocer cuándo se realizaron cambios relevantes.
- Relacionar cambios con decisiones arquitectónicas.
- Facilitar diagnóstico de problemas futuros.

---

# Formato

Cada entrada deberá incluir:

- Fecha.
- Versión o fase.
- Tipo de cambio.
- Descripción.
- Documentos relacionados.

---

# Historial

---

# 2026-08-03

## Documentación arquitectónica inicial

### Tipo

Documentación

### Cambios realizados

Creación de la estructura inicial de documentación:

- Project Master Context.
- Architecture.
- Roadmap.
- Architecture Decisions.
- Clinical Domain.
- Clinical Rule Engine.
- Clinical Analysis Engine.
- Clinical Reports.
- Health Connect Integration.
- Database Architecture.

---

## Decisiones documentadas

Se establecieron principios arquitectónicos:

- Separación entre dominio y presentación.
- Separación entre mediciones y contexto clínico.
- Uso de contextos clínicos opcionales.
- Health Connect como fuente externa de contexto.
- Importación y exportación mediante adaptadores.

---

## Estado actual

Fase actual:

🚧 Refactorización Final del Dominio

Objetivo:

Separar completamente:

- Datos propios de medición.
- Datos clínicos.
- Datos externos.
- Resultados derivados.

---

# Próximas actualizaciones

Cada fase completada deberá agregar:

- Fecha.
- Funcionalidad implementada.
- Archivos principales afectados.
- Decisiones asociadas.
- Documentación actualizada.

