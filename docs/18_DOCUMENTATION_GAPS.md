# CardioSync — Brechas de documentación

| Campo | Valor |
|---|---|
| Documento | 18_DOCUMENTATION_GAPS.md |
| Tipo | Auditoría de documentación |
| Estado | Activo |
| Última actualización | 2026-10-17 |

---

## Objetivo

Registrar discrepancias documentales conocidas y priorizar su resolución sin afirmar capacidades que no estén respaldadas por el código o por pruebas verificables.

## Brechas identificadas

### 1. Roadmap frente a implementación

**Prioridad:** Alta

**Acción:** Mantener diferenciados los estados implementado, validación pendiente, en desarrollo y planificado. Revisar OTA, actualización APK, backup y Health Connect contra los servicios actuales.

### 2. Health Connect

**Prioridad:** Alta

**Brecha:** La documentación de diseño presenta una integración más amplia que el servicio observado, que inicializa Health Connect y solicita permisos.

**Acción:** Documentar por separado inicialización, permisos, lectura, escritura, sincronización, deduplicación y tratamiento de revocaciones, indicando qué está implementado y probado.

### 3. Backup y recuperación

**Prioridad:** Alta

**Brecha:** Existen servicios para crear copias SQLite, exportación manual, Google Drive y programación, pero no debe declararse completo el ciclo de recuperación sin localizar y validar restauración y retención.

**Acción:** Auditar el repositorio completo y documentar restauración, retención, errores y pruebas de dispositivo.

### 4. Importación y exportación

**Prioridad:** Alta

**Brecha:** La documentación de base de datos aún contiene descripciones de importación/exportación como planificadas, mientras que existen flujos en la aplicación.

**Acción:** Verificar formatos reales, validaciones, límites, errores y persistencia; actualizar la especificación sin ampliar el soporte por inferencia.

### 5. Reportes

**Prioridad:** Media

**Brecha:** La documentación conceptual contempla un reporte médico especializado, mientras que la implementación descrita se centra en el reporte PDF actual.

**Acción:** Separar alcance disponible y evolución planificada, incluidos datos y fuentes clínicas realmente incluidos.

### 6. Árbol histórico y dominio clínico actual

**Prioridad:** Media

**Brecha:** Conviven referencias a `src/clinical/` y al dominio actual `src/domain/clinical/`.

**Acción:** Documentar responsabilidades, dependencias y estado de migración antes de retirar código histórico.

### 7. Validaciones y checkpoints

**Prioridad:** Media

**Brecha:** Los documentos históricos registran validaciones de fechas anteriores que no prueban automáticamente el estado del commit actual.

**Acción:** Cada actualización debe indicar qué se inspeccionó, qué comandos/pruebas se ejecutaron y qué quedó sin verificar.

### 8. Distribución y actualizaciones

**Prioridad:** Media

**Brecha:** La guía de publicación debe reflejar los requisitos por canal/tienda y la separación entre OTA y APK nativa.

**Acción:** Mantener un procedimiento verificable de runtime, canal, commit, cambios nativos, firma y artefacto de producción.

---

## Orden recomendado

1. Confirmar el estado de recuperación y retención de backups.
2. Verificar alcance real de Health Connect.
3. Alinear importación/exportación y base de datos.
4. Alinear decisiones arquitectónicas y changelog.
5. Revisar documentos de módulos y estructura de carpetas.
6. Revisar reportes clínicos y brechas restantes.

## Regla de cierre

Una brecha solo se cierra cuando el documento se contrasta con código y, si corresponde, con pruebas reproducibles o evidencia de dispositivo. Un cambio de documentación por sí solo no demuestra que una funcionalidad se haya implementado.
