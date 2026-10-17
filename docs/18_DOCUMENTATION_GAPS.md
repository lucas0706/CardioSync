# CardioSync — Pendientes documentales y de validación

| Campo | Valor |
|---|---|
| Documento | 18_DOCUMENTATION_GAPS.md |
| Tipo | Registro de pendientes documentales y validaciones no demostradas |
| Estado | Activo |
| Última revisión | 2026-10-17 |

## Propósito

Registrar únicamente pendientes que siguen siendo relevantes después de las actualizaciones documentales realizadas el 17-10-2026. Este archivo no sustituye las pruebas ni debe conservar como brecha documental una tarea ya resuelta por los PR #19–#25 y #57–#98.

## Pendientes vigentes

### 1. Constitución del proyecto

**Estado:** pendiente de contenido en la rama base revisada.

**Acción:** definir principios estables sin duplicar la arquitectura, las decisiones ADR ni las guías operativas. Si no aporta un nivel normativo propio, reconsiderar su existencia. La propuesta se encuentra en el PR documental correspondiente.

### 2. Diseño conceptual del dominio clínico

**Estado:** diseño e implementación parcial.

**Acción:** mantener explícita la diferencia entre el perfil clínico opcional actualmente disponible y el ClinicalContext integral descrito como objetivo. No afirmar que los contextos opcionales de sueño, actividad, composición corporal, síntomas y signos vitales estén integrados en producción sin evidencia.

### 3. Validación funcional de Health Connect

**Estado:** la documentación de alcance ya fue actualizada; la validación funcional es independiente.

**Acción:** comprobar por separado inicialización, permisos, lectura/escritura soportada, revocaciones y comportamiento en dispositivo. No convertir la existencia del servicio o de permisos declarados en prueba de un flujo completo.

### 4. Backup, restauración y programación

**Estado:** existe una guía de backup y recuperación; la guía deja constancia de límites y validaciones pendientes.

**Acción:** validar en dispositivo la creación, acceso a Google Drive, ejecución programada, errores y restauración. No afirmar que retención o recuperación estén completamente validadas sin pruebas reproducibles.

### 5. Importación y exportación

**Estado:** documentación de base de datos y especificación de importación ya fueron alineadas con el alcance observado.

**Acción:** si cambia el código, actualizar formatos, validaciones, deduplicación y errores en la misma revisión. No se registra como brecha documental abierta por el mero hecho de que existan escenarios no soportados.

### 6. Reportes

**Estado:** alcance del reporte actual y del reporte médico planificado documentados en docs/07_REPORTS.md.

**Acción:** validar en dispositivo el PDF real y sus datos antes de ampliar el estado a completo. El reporte médico planificado no debe presentarse como implementado.

### 7. Arquitectura clínica histórica y actual

**Estado:** la documentación clínica específica fue revisada en los PR #57–#98; los documentos conceptuales generales requieren distinguir implementación y diseño futuro.

**Acción:** mantener clara la separación entre el dominio clínico actual y el árbol histórico src/clinical/. No retirar código histórico sin una decisión y validación independiente.

### 8. Fechas de revisión documental

**Estado:** algunos documentos generales conservan fechas de actualización anteriores a las revisiones documentales recientes.

**Acción:** actualizar la fecha solo cuando el contenido del archivo se haya revisado en el cambio correspondiente. La fecha indica revisión documental, no certifica pruebas funcionales.

### 9. Configuración de releases

**Estado:** docs/14_RELEASES_AND_UPDATES.md debe referenciar inequívocamente la rama inspeccionada y diferenciar valores declarados de configuración efectiva remota.

**Acción:** antes de cada build u OTA, comprobar commit, estado Git, Expo Config efectivo, perfil, runtime y canal; registrar resultados y validación del artefacto o dispositivo.

### 10. Documento de instrucciones clínicas fuera de docs/

**Estado:** CLINICAL_KNOWLEDGE_BASE_PHASE1.md contiene instrucciones antiguas que piden comparar cuatro guías, mientras que la documentación actual no declara implementado ese conjunto de cuatro motores.

**Acción:** retirar ese artefacto de instrucciones obsoleto o reemplazarlo por un plan vigente antes de reutilizarlo. No usarlo como fuente clínica ni como evidencia de soporte implementado.

## Documentos revisados anteriormente

Los PR #19–#25 trataron documentación de reportes, Health Connect, base de datos, importación/exportación, releases, backup y flujo de trabajo. Los PR #57–#98 revisaron los documentos clínicos específicos. No repetir esas actualizaciones salvo que aparezca una discrepancia concreta nueva.

## Criterio de cierre

- Una brecha documental se cierra cuando el contenido se alinea con el código y con las decisiones vigentes.
- Una validación funcional solo se cierra con evidencia reproducible o de dispositivo adecuada.
- Un PR documental no demuestra que una funcionalidad esté implementada o probada.
- Toda afirmación debe indicar el alcance y las limitaciones que realmente se han comprobado.
