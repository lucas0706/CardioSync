# BloodPressureRecord

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir BloodPressureRecord como la entidad central del dominio clínico de
CardioSync.

BloodPressureRecord representa un evento de medición de presión arterial
registrado en el sistema.

---

# 2. Principio fundamental

La medición es el núcleo del dominio.

CardioSync mantiene la separación:

Registro:

BloodPressureRecord


Contexto:

ClinicalContext


Interpretación:

ClinicalAnalysis


Estadística:

Statistics


---

# 3. Responsabilidad

BloodPressureRecord responde:

¿Qué medición fue registrada?

Incluye:

- valores obtenidos;
- fecha y hora;
- información propia del evento de medición.


No incluye:

- clasificación clínica;
- diagnóstico;
- riesgo;
- recomendaciones.


---

# 4. Modelo conceptual

BloodPressureRecord

├── id

├── dateTime

├── systolic

├── diastolic

├── heartRate?

├── weight?

├── notes?

├── source

├── createdAt

└── updatedAt


---

# 5. Datos obligatorios

## Systolic

Presión arterial sistólica.

Unidad:

mmHg.


---

## Diastolic

Presión arterial diastólica.

Unidad:

mmHg.


---

## DateTime

Momento en que fue realizada la medición.

Permite:

- análisis temporal;
- correlación con contexto;
- estadísticas.


---

# 6. Datos opcionales

Pueden existir datos complementarios:

- frecuencia cardíaca;
- peso;
- notas;
- información técnica.


Estos datos no deben impedir el registro principal.

---

# 7. Relación con ClinicalContext

Una medición puede existir sin contexto.

Modelo:

BloodPressureRecord

1

↓

0..1

ClinicalContext


El contexto puede agregarse posteriormente.

---

# 8. Relación con Statistics

Statistics utiliza múltiples mediciones para analizar:

- tendencias;
- promedios;
- variabilidad;
- evolución temporal.


---

# 9. Relación con ClinicalAnalysis

ClinicalAnalysis utiliza:

- BloodPressureRecord;
- ClinicalContext;
- ClinicalGuideline.


El análisis nunca modifica la medición original.

---

# 10. Origen del dato

Fuentes posibles:

- manual;
- importación;
- Health Connect;
- dispositivos futuros.


El origen debe mantenerse como metadata.

---

# 11. Integridad histórica

Los registros de mediciones deben conservar trazabilidad.

Las modificaciones deben ser explícitas.

No se deben alterar silenciosamente datos históricos.

---

# 12. Decisiones arquitectónicas

## ADR-001

BloodPressureRecord es el núcleo del dominio.


## ADR-002

La interpretación clínica permanece separada del registro.


## ADR-003

Las fuentes externas se adaptan al dominio.


---

# 13. Riesgos

Evitar:

- mezclar reglas clínicas con almacenamiento;
- guardar diagnósticos dentro del registro;
- depender de un proveedor específico;
- perder valores originales.


---

# 14. Impacto en CardioSync

Utilizado por:

- MeasurementForm;
- History;
- ClinicalChart;
- Statistics;
- ClinicalContext;
- ClinicalAnalysis.


---

# 15. Estado

Draft.

Pendiente:

- revisión contra modelo actual de src/domain;
- alineación con exportación/importación;
- validación clínica final.
