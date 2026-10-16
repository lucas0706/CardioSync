# CardioSync — Especificación de Importación Histórica

| Campo | Valor |
|---|---|
| Documento | 13_IMPORTATION_SPECIFICATION.md |
| Tipo | Especificación funcional y técnica |
| Estado | Implementación SQLite validada |
| Fecha | 2026-08-12 |
| Fuente real analizada | BPTracker |
| Registros analizados | 2.030 |

---

# 1. Objetivo

Definir la estrategia para importar datos históricos provenientes de la aplicación actualmente utilizada por el usuario.

La especificación se basa en archivos reales exportados por dicha aplicación.

El importador utiliza un pipeline específico para SQLite y reutiliza la normalización, validación, deduplicación y persistencia comunes de CardioSync.

---

# 2. Fuentes reales analizadas

Se analizaron tres representaciones del histórico:

- Base SQLite `.db`.
- Exportación `.csv`.
- Exportación `.xls`.

La base SQLite contiene la tabla principal `tranx`.

Las representaciones analizadas corresponden al mismo histórico de 2.030 registros.

La implementación validada utiliza actualmente la base SQLite como fuente de importación.

El formato XLS fue descartado como vía de implementación por requerir una dependencia de parsing externa con problemas de seguridad conocidos en la versión evaluada.

No se incorporó `xlsx` al proyecto CardioSync.

---

# 3. Campos de la fuente SQLite

La tabla `tranx` contiene, entre otros, los siguientes campos:

- `sys`
- `dia`
- `pulse`
- `weight`
- `siteId`
- `positionID`
- `note`
- `tranxDate`
- `tranxTime`
- `glucose`
- `oxygen`
- `temperature`
- `heightValue`
- `heightValueCm`
- `weightKg`
- `bmi`
- `bfp`
- `arrhythmia`
- `afib`
- `hrv`
- `medTaken`
- otros campos específicos de la aplicación de origen.

La importación inicial utiliza únicamente los campos necesarios para construir una medición de presión arterial compatible con CardioSync.

---

# 4. Mapeo principal

| Fuente SQLite | CardioSync | Regla |
|---|---|---|
| `tranxDate` + `tranxTime` | `dateTime` | Combinar fecha y hora |
| `sys` | `systolic` | Validar rango actual |
| `dia` | `diastolic` | Validar rango actual |
| `pulse` | `heartRate` | Opcional |
| `siteId` | `arm` | Mapear valores conocidos |
| `positionID` | `position` | Mapear valores conocidos |
| `note` | `notes` | Vacío → ausencia |

---

# 5. Reglas de validación

Se reutilizan las reglas existentes de CardioSync.

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

No se modificó el schema para aceptar valores inválidos provenientes del archivo externo.

---

# 6. Frecuencia cardíaca

La fuente real contiene registros donde la frecuencia cardíaca puede estar ausente.

La implementación mantiene la ausencia como:

`heartRate = undefined`

No se transforma una ausencia en `0`.

En la base SQLite analizada:

- 2.030 registros totales.
- 0 registros con `pulse = NULL`.
- 0 registros con `pulse = 0`.

La exportación CSV analizada previamente presentó 4 registros sin pulso; esto se considera una diferencia de representación del formato exportado y no modifica la regla de normalización.

---

# 7. Mapeo de brazo

La fuente SQLite utiliza:

- `siteId = 0` → brazo izquierdo.
- `siteId = 1` → brazo derecho.

Mapeo:

| Fuente | CardioSync |
|---|---|
| `0` | `left` |
| `1` | `right` |

Los valores desconocidos no se infieren.

En la base real:

- `siteId = 0`: 2.019 registros.
- `siteId = 1`: 11 registros.

---

# 8. Mapeo de posición

La fuente SQLite utiliza:

- `positionID = 0` → sentado.
- `positionID = 1` → de pie.
- `positionID = 2` → acostado.

Mapeo:

| Fuente | CardioSync |
|---|---|
| `0` | `sitting` |
| `1` | `standing` |
| `2` | `lying` |

En la base real analizada:

- `positionID = 0`: 2.030 registros.

---

# 9. Notas

Las notas se obtienen desde `tranx.note`.

Las notas vacías se normalizan como ausencia.

Las notas existentes se conservan.

No se generan textos artificiales.

---

# 10. Campos secundarios

La base SQLite contiene información adicional como:

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

Estos datos no se incorporan automáticamente al núcleo de importación.

La presencia de un valor `0` en la base de origen no implica necesariamente que exista una medición clínica real.

La decisión mantiene el núcleo de `BloodPressureRecord` centrado en la medición de presión arterial.

---

# 11. Categorías de la aplicación de origen

La aplicación de origen proporciona categorías derivadas de los valores de presión.

Estas categorías no se importan como clasificación clínica de CardioSync.

CardioSync mantiene sus propias reglas clínicas y estadísticas.

---

# 12. Identidad de los registros

La base SQLite de origen no proporciona un identificador de medición equivalente al `id` de `BloodPressureRecord`.

CardioSync genera un nuevo identificador para cada registro importado.

No se utiliza el `rowid` externo como identificador permanente.

---

# 13. Duplicados

La implementación detecta duplicados antes de persistir.

La deduplicación utiliza la combinación:

- fecha/hora;
- sistólica;
- diastólica;
- frecuencia cardíaca;
- brazo;
- posición;
- nota.

No se eliminan registros únicamente por tener la misma presión.

Durante la prueba real se detectó:

- 2.030 registros leídos.
- 1 duplicado interno.
- 2.029 registros únicos válidos.

El duplicado fue descartado antes de la persistencia.

---

# 14. Procedencia

El dominio contiene `MeasurementOrigin` con valores:

- `manual`
- `csv-import`
- `excel-import`
- `database-import`
- `external-app`

Actualmente `origin` no se persiste en `blood_pressure_records`.

Para esta fase no se agregó una columna nueva únicamente para resolver la importación.

La procedencia podrá persistirse posteriormente si existe una necesidad funcional real.

---

# 15. Arquitectura de importación

El pipeline implementado es:

Fuente SQLite
↓
Document Picker
↓
Copia temporal en cache
↓
Validación de estructura SQLite
↓
Parser específico
↓
NormalizedImportRecord
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
Persistencia
↓
CardioSync

La copia temporal de la base externa se elimina después del procesamiento.

---

# 16. Validación de estructura SQLite

Antes de procesar registros, el parser verifica:

1. Existencia de la tabla `tranx`.
2. Existencia de las columnas requeridas.

Columnas requeridas:

- `sys`
- `dia`
- `pulse`
- `siteId`
- `positionID`
- `note`
- `tranxDate`
- `tranxTime`

Una base incompatible produce un error explícito y no se procesa como si fuera válida.

---

# 17. Vista previa

Antes de persistir, CardioSync presenta:

- registros detectados;
- registros válidos;
- duplicados;
- errores;
- registros sin frecuencia cardíaca;
- registros ya existentes en CardioSync;
- nuevos registros para importar.

La persistencia solamente se ejecuta después de la confirmación del usuario.

---

# 18. Detección de registros ya existentes

Antes de importar se compara cada `NormalizedImportRecord` con las mediciones existentes en CardioSync.

Esto permite distinguir:

- registros nuevos;
- registros que ya existen;
- duplicados internos de la fuente.

Durante la prueba de importación, el histórico de CardioSync fue limpiado previamente para validar la importación desde cero.

Resultado:

- 2.030 detectados.
- 2.029 válidos.
- 1 duplicado.
- 0 errores.
- 2.029 nuevos para importar.
- 2.029 mediciones persistidas.

---

# 19. Persistencia

La persistencia reutiliza:

- `ImportPersistenceService`.
- `MeasurementService`.
- `MeasurementStore`.
- `BloodPressureRepository`.
- SQLite mediante `expo-sqlite`.

La implementación utiliza `createMany()` para realizar la inserción por lote en lugar de ejecutar una operación individual desde la interfaz para cada registro.

La operación se ejecuta dentro de `database.withTransactionSync()`, por lo que la inserción por lote se realiza de forma transaccional.

---

# 20. Errores de importación

Un registro inválido no se convierte silenciosamente en un registro válido.

El pipeline puede identificar:

- fecha inválida;
- sistólica fuera de rango;
- diastólica fuera de rango;
- frecuencia cardíaca inválida;
- estructura SQLite incompatible;
- columnas requeridas ausentes.

Los errores se incorporan al resultado de importación.

---

# 21. Volumen

La fuente real utilizada contiene:

`2.030 registros`

La implementación fue validada con este volumen real.

La arquitectura queda preparada para evaluar posteriormente volúmenes superiores, incluyendo:

- 10.000 registros;
- 50.000+ registros.

La optimización específica para grandes volúmenes queda fuera de esta validación.

---

# 22. Compatibilidad arquitectónica

La implementación mantiene:

- Expo SDK 57.
- TypeScript strict.
- `expo-sqlite`.
- `expo-document-picker`.
- `expo-file-system`.
- `src/core`.
- `src/domain`.
- `src/features`.
- `src/components`.

No se incorporaron dependencias adicionales para leer SQLite.

No se incorporó `xlsx`.

No se incorporó:

- Clinical Rule Engine;
- Clinical Analysis Engine;
- ClinicalContext como dependencia del importador;
- nueva arquitectura médica.

---

# 23. Alcance

Esta fase incluye:

- selección del archivo SQLite;
- lectura del formato real;
- validación estructural;
- parsing;
- normalización;
- validación;
- deduplicación;
- detección de registros existentes;
- vista previa;
- confirmación;
- persistencia.

Esta fase no incluye:

- Health Connect;
- motor clínico;
- diagnóstico;
- prescripción;
- clasificación clínica propia;
- migración automática de todos los campos secundarios de BPTracker.

---

# 24. Validación funcional real

Se realizó una prueba end-to-end utilizando la base:

`bptracker_2026_08_11.db`

Características de la fuente:

- SQLite 3.x.
- Tabla principal: `tranx`.
- 2.030 registros.
- Rango temporal: 2023-10-26 → 2026-08-11.

Resultado de la importación:

| Resultado | Cantidad |
|---|---:|
| Registros detectados | 2.030 |
| Registros válidos | 2.029 |
| Duplicados internos | 1 |
| Errores | 0 |
| Nuevos para importar | 2.029 |
| Importados | 2.029 |

Después de la importación:

- History mostró los registros importados.
- Dashboard utilizó los datos importados.
- Statistics utilizó los datos importados.
- La aplicación fue reiniciada.
- Los 2.029 registros permanecieron después del reinicio.

Esto valida el flujo de importación y persistencia real.

---

# 25. Resultado de la fase

**FASE 2 — Especificación:** COMPLETADA

**Implementación SQLite:** COMPLETADA

**Prueba end-to-end:** COMPLETADA

**Persistencia después de reinicio:** VALIDADA

**Importación XLS:** DESCARTADA

**Dependencia `xlsx`:** NO INCORPORADA

**Atomicidad transaccional:** VALIDADA mediante `database.withTransactionSync()`.

---

# 26. Criterio de finalización

La implementación actual cumple los siguientes criterios:

1. CardioSync lee correctamente la base SQLite real.
2. Los 2.030 registros pueden analizarse.
3. Los campos principales se mapean correctamente.
4. La estructura SQLite se valida antes de procesar.
5. Los duplicados son detectados.
6. Los datos inválidos no se importan silenciosamente.
7. El usuario puede revisar una vista previa.
8. Se detectan registros ya existentes.
9. La persistencia utiliza operación por lote.
10. Los registros aparecen correctamente en History.
11. Dashboard utiliza los datos importados.
12. Statistics utiliza los datos importados.
13. Los registros sobreviven al reinicio de la aplicación.
14. `npx tsc --noEmit` permanece limpio.
15. `git diff --check` permanece limpio.
16. La documentación queda sincronizada.

La atomicidad transaccional de `createMany()` quedó verificada.
