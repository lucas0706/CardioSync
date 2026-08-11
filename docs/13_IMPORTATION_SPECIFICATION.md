# CardioSync — Especificación de Importación Histórica

| Campo | Valor |
|---|---|
| Documento | 13_IMPORTATION_SPECIFICATION.md |
| Tipo | Especificación funcional y técnica |
| Estado | Aprobada para implementación |
| Fecha | 2026-08-11 |
| Fuente real analizada | BPTracker |
| Registros analizados | 2.030 |

---

# 1. Objetivo

Definir la estrategia para importar datos históricos provenientes de la aplicación actualmente utilizada por el usuario.

La especificación se basa en archivos reales exportados por dicha aplicación.

No se diseñará inicialmente un importador genérico independiente del formato.

---

# 2. Fuentes reales analizadas

Se analizaron tres representaciones del histórico:

- Base SQLite `.db`.
- Exportación `.csv`.
- Exportación `.xls`.

La base SQLite contiene la tabla principal `tranx`.

Las exportaciones CSV y XLS contienen el mismo histórico de 2.030 registros y presentan una estructura equivalente.

---

# 3. Campos de la exportación CSV/XLS

La exportación contiene:

- Fecha
- Sistólica
- Diastólica
- Pulso
- Altura(cm)
- Sitio
- Posición
- Categoría
- Ignorar cálculo
- Nota
- Etiqueta

---

# 4. Mapeo principal

| Fuente | CardioSync | Regla |
|---|---|---|
| Fecha | `dateTime` | Combinar fecha y hora y normalizar a ISO |
| Sistólica | `systolic` | Validar rango actual |
| Diastólica | `diastolic` | Validar rango actual |
| Pulso | `heartRate` | Opcional; valores ausentes se normalizan |
| Sitio | `arm` | Mapear valores conocidos |
| Posición | `position` | Mapear valores conocidos |
| Nota | `notes` | Vacío → ausencia |

---

# 5. Reglas de validación

Se reutilizarán las reglas existentes de CardioSync.

## Sistólica

Rango:

`40–300`

## Diastólica

Rango:

`20–200`

## Frecuencia cardíaca

Rango:

`20–250`

La frecuencia cardíaca es opcional.

No se modificará el schema para aceptar valores inválidos provenientes del archivo externo.

---

# 6. Frecuencia cardíaca ausente

En el archivo real existen registros sin frecuencia cardíaca.

La validación confirmó:

- 4 registros con `Pulso` vacío.
- 0 registros con `Pulso = 0`.

Por lo tanto:

`Pulso vacío → heartRate ausente`

No se importará un valor ausente como frecuencia cardíaca `0`.

No se inventará ningún valor.

---

# 7. Mapeo de brazo

La exportación real contiene:

- `Brazo izquierdo`
- `Brazo derecho`

Mapeo:

| Fuente | CardioSync |
|---|---|
| Brazo izquierdo | `left` |
| Brazo derecho | `right` |

Los valores desconocidos no se inferirán.

---

# 8. Mapeo de posición

La exportación real contiene:

`Sentado`

Mapeo:

`Sentado → sitting`

No se inferirán posiciones no presentes en el archivo.

---

# 9. Notas

La mayoría de los registros no contienen notas.

Las notas vacías se normalizarán como ausencia.

No se generarán textos artificiales.

Las notas existentes se conservarán.

---

# 10. Campos que no se importarán inicialmente

No se incorporarán automáticamente:

- Altura.
- Categoría.
- Ignorar cálculo.
- Etiqueta.

La razón es mantener el núcleo de `BloodPressureRecord` centrado en la medición de presión arterial y no importar automáticamente información derivada o campos que pertenecen a otros dominios.

---

# 11. Categoría de la aplicación de origen

La aplicación de origen proporciona categorías como:

- Normal.
- Alto Normal.
- Hipertensión Etapa 1.
- Hipertensión Etapa 2.

Estas categorías no se importarán como clasificación clínica de CardioSync.

Son datos derivados por la aplicación de origen.

CardioSync mantendrá sus propias reglas y estadísticas.

---

# 12. Base SQLite de origen

La base externa contiene información adicional como:

- peso;
- glucosa;
- oxígeno;
- temperatura;
- altura;
- BMI;
- porcentaje de grasa;
- arritmia;
- fibrilación auricular;
- HRV;
- medicación;
- otros campos.

Estos datos no se incorporarán automáticamente al núcleo de importación.

La presencia de un valor `0` en la base de origen no implica que exista una medición real.

---

# 13. Identidad de los registros

La base SQLite de origen no proporciona un identificador de medición equivalente al `id` de `BloodPressureRecord`.

CardioSync generará un nuevo identificador para cada registro importado.

No se utilizará el `rowid` de SQLite externo como identificador permanente de CardioSync.

---

# 14. Duplicados

Durante el análisis se encontró un duplicado exacto:

`27/05/2026 19:14 — 114/75 — FC 77`

aparece dos veces.

La importación deberá detectar duplicados antes de persistir.

La deduplicación inicial utilizará la combinación de los campos de medición relevantes:

- fecha/hora;
- sistólica;
- diastólica;
- frecuencia cardíaca;
- brazo;
- posición;
- nota.

No se eliminarán registros únicamente por tener la misma presión.

---

# 15. Procedencia

El dominio actual contiene:

`MeasurementOrigin`

con los valores:

- `manual`
- `csv-import`
- `excel-import`
- `database-import`
- `external-app`

Actualmente `origin` no se persiste en `blood_pressure_records`.

Para esta fase no se agregará una columna nueva solamente para resolver la importación.

La procedencia podrá utilizarse posteriormente si existe una necesidad funcional real de persistirla.

---

# 16. Arquitectura de importación

El pipeline previsto es:

Fuente
↓
Parser específico
↓
Registro normalizado de importación
↓
Normalización
↓
Validación
↓
Deduplicación
↓
Vista previa
↓
Confirmación
↓
Persistencia transaccional
↓
CardioSync

---

# 17. Múltiples formatos

No se implementarán tres pipelines independientes.

La arquitectura prevista es:

SQLite parser
CSV parser
XLS parser
        ↓
NormalizedImportRecord
        ↓
Validación común
        ↓
Deduplicación común
        ↓
Persistencia común

Esto permitirá incorporar otros formatos posteriormente sin duplicar la lógica de negocio.

---

# 18. Persistencia

La importación no utilizará:

`measurementService.create()`

2.030 veces de forma individual.

Se implementará una operación específica de importación por lote.

La operación deberá ejecutarse de forma transaccional para evitar estados parciales si ocurre un error durante la importación.

No se agregará una dependencia externa para esto.

Se utilizará la infraestructura SQLite compatible con Expo SDK 57 ya instalada en el proyecto.

---

# 19. Vista previa

Antes de persistir los registros importados, CardioSync deberá poder mostrar al usuario:

- cantidad total de registros detectados;
- registros válidos;
- registros inválidos;
- duplicados detectados;
- registros con campos normalizados;
- registros que serán importados.

El usuario deberá confirmar la importación.

---

# 20. Errores de importación

Un registro inválido no debe convertirse silenciosamente en un registro válido.

La importación deberá identificar:

- fecha inválida;
- sistólica fuera de rango;
- diastólica fuera de rango;
- frecuencia cardíaca inválida;
- valores desconocidos de brazo;
- valores desconocidos de posición;
- estructura de archivo incompatible.

Los errores deberán poder identificarse antes de confirmar la importación.

---

# 21. Volumen

El archivo real contiene 2.030 registros.

La implementación deberá evitar cargar o procesar innecesariamente grandes estructuras duplicadas en memoria.

La arquitectura deberá permitir posteriormente evaluar:

- 10.000 registros;
- 50.000+ registros.

La optimización específica para grandes volúmenes se validará en la Fase 3.

---

# 22. Compatibilidad arquitectónica

La implementación deberá mantener:

- Expo SDK 57.
- TypeScript strict.
- SQLite existente.
- `src/core`.
- `src/domain`.
- `src/features`.
- `src/components`.

No se incorporará:

- Clinical Rule Engine.
- Clinical Analysis Engine.
- ClinicalContext como dependencia del importador.
- Nueva arquitectura médica.

---

# 23. Alcance de esta fase

Esta fase incluye:

- lectura del formato real;
- detección;
- parsing;
- normalización;
- validación;
- deduplicación;
- vista previa;
- confirmación;
- persistencia.

Esta fase no incluye:

- Health Connect.
- motor clínico.
- diagnóstico.
- prescripción.
- clasificación clínica propia.
- migración automática de todos los campos secundarios de BPTracker.

---

# 24. Criterio de finalización

La Fase 2 se considerará completada cuando:

1. CardioSync pueda leer correctamente el archivo real.
2. Los 2.030 registros puedan analizarse.
3. Los campos principales se mapeen correctamente.
4. Los cuatro `Pulso = 0` sean tratados como ausencia.
5. El duplicado conocido sea detectado.
6. Los datos inválidos no sean importados silenciosamente.
7. El usuario pueda revisar una vista previa.
8. La importación sea transaccional.
9. Los registros aparezcan correctamente en History.
10. Dashboard utilice los datos importados.
11. Statistics utilice los datos importados.
12. Reports utilice los datos importados.
13. `npx tsc --noEmit` permanezca limpio.
14. La documentación quede sincronizada.

---

# 25. Estado

**FASE 2 — Especificación:** ✅ COMPLETADA

**Implementación del importador:** 📋 SIGUIENTE PASO
