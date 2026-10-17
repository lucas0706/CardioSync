# CardioSync — Pendientes de validación y documentación

| Campo | Valor |
|---|---|
| Documento | 18_DOCUMENTATION_GAPS.md |
| Tipo | Registro de validaciones pendientes y discrepancias documentales |
| Estado | Activo |
| Última revisión | 2026-10-17 |

## Propósito

Registrar únicamente asuntos que continúan pendientes después de las actualizaciones documentales fusionadas en los PR #99–#114. Una mejora documental no constituye por sí misma evidencia de validación funcional.

## Estado del trabajo documental

- La constitución del proyecto se completó en el PR #99.
- Los documentos conceptuales generales del dominio clínico, motor de reglas y análisis se alinearon en los PR #100–#102 para distinguir implementación de diseño futuro.
- Este registro se actualizó en el PR #103 y se debe mantener sincronizado con el estado de validación.
- El artefacto de instrucciones obsoleto que pedía comparar cuatro guías fue retirado en el PR #104.
- Los documentos de decisiones, changelog, módulos, estructura, guías de documentación, reportes, Health Connect, base de datos, importación y releases fueron revisados en los PR #105–#114. La fecha de revisión documental no certifica pruebas de dispositivo.

## Validaciones funcionales que siguen requiriendo evidencia

### 1. Health Connect

La documentación distingue inicialización y solicitud de permisos de los flujos de integración más amplios.

**Pendiente:** validar en dispositivos compatibles los flujos efectivamente soportados: permisos, lectura/escritura correspondiente, revocaciones y tratamiento de errores. No afirmar que la integración completa esté validada por la mera presencia del servicio o de permisos declarados.

### 2. Backup, restauración y programación

La guía de backup y recuperación documenta el alcance conocido y sus límites.

**Pendiente:** validar en dispositivo creación de copias, acceso a Google Drive, ejecución programada, errores y restauración. No afirmar que la recuperación o la retención estén completamente validadas sin pruebas reproducibles.

### 3. Importación y exportación

La documentación de base de datos y la especificación de importación se alinearon con el alcance observado.

**Pendiente:** conservar pruebas reproducibles de formatos, validaciones, deduplicación, persistencia y manejo de errores al cambiar el código. No inferir soporte para formatos o escenarios no implementados.

### 4. Reportes

La documentación separa el reporte PDF actual del reporte médico planificado.

**Pendiente:** validar en dispositivo el PDF generado y los datos que realmente incluye antes de declarar completa la funcionalidad. No presentar el reporte médico planificado como implementado.

### 5. Dominio clínico

Los documentos clínicos describen las reglas activas y distinguen los contextos que siguen siendo diseño futuro.

**Pendiente:** validar las integraciones de producción que requieran un contexto clínico compuesto y mantener la separación entre el dominio actual y el árbol histórico src/clinical/. No retirar código histórico sin una decisión y validación independientes.

### 6. Publicaciones y actualizaciones

La guía de releases distingue configuración declarada de configuración efectiva.

**Pendiente:** antes de cada build u OTA, verificar commit, estado Git, Expo Config efectivo, perfil, runtime y canal; registrar el artefacto o Update Group ID y la validación en dispositivo. Esta lista no sustituye el procedimiento obligatorio de publicación.

## Criterio de cierre

- Una discrepancia documental se cierra cuando el documento se alinea con el código y las decisiones vigentes.
- Una validación funcional solo se cierra con evidencia reproducible o de dispositivo adecuada.
- Un PR documental no demuestra que una funcionalidad esté implementada o probada.
- Los documentos históricos y las fechas de revisión no sustituyen la verificación del commit objetivo.
