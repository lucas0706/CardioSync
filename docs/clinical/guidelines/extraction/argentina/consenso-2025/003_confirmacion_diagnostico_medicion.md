# Extracción 003 — Confirmación diagnóstica y medición de presión arterial

## Fuente

Documento:

Consenso Argentino de Hipertensión Arterial 2025

Organizaciones:

- Federación Argentina de Cardiología (FAC)
- Sociedad Argentina de Hipertensión Arterial (SAHA)
- Sociedad Argentina de Cardiología (SAC)

Referencia:

Rev Fed Arg Cardiol. 2025; 54 (Suplemento 6): 5-64

---

## Ubicación

Página:

10-12

Sección:

Detectar y confirmar la presencia de hipertensión arterial.

---

## Clinical Statement

El diagnóstico de hipertensión arterial comienza con la búsqueda de los
valores de presión arterial y la medición adecuada de la misma.

Los métodos utilizados para evaluar la presión arterial son:

- Presión arterial de consultorio (PAC).
- Monitoreo Ambulatorio de Presión Arterial de 24 horas (MAPA).
- Monitoreo Domiciliario de Presión Arterial (MDPA).

---

## Presión arterial de consultorio (PAC)

La PAC es el método tradicional sobre el cual se basaron durante décadas las
conductas terapéuticas.

El consenso indica que:

- posee menor valor pronóstico que la medición fuera del consultorio;
- presenta sesgos como reacción de alarma y redondeo de valores;
- como único método de evaluación resulta insuficiente.

Puede utilizarse como herramienta inicial de screening y frecuentemente
requiere confirmación mediante MAPA y/o MDPA.

---

## Técnica y equipamiento

Se recomienda:

- tensiómetro automático oscilométrico validado;
- medición en brazo;
- brazalete adecuado.

En la primera visita:

- medir PA en ambos brazos;
- si existe diferencia interbraquial de PAS ≥10 mmHg confirmada,
  utilizar posteriormente el brazo con la PA más elevada.

---

## MAPA

El monitoreo ambulatorio de presión arterial de 24 horas posee evidencia
acumulada y mayor valor pronóstico que la PAC para:

- daño de órgano blanco;
- eventos cardiovasculares;
- mortalidad cardiovascular.

Permite evaluar:

- promedio de PA de 24 horas;
- promedio diurno;
- promedio nocturno;
- ritmo circadiano.

Valores de definición de HTA por MAPA:

| Parámetro | Valor |
|---|---:|
| Promedio 24 horas | ≥130/80 mmHg |
| Promedio diurno | ≥135/85 mmHg |
| Promedio nocturno | ≥120/70 mmHg |

---

## Clinical Meaning

La medición de presión arterial requiere conservar información adicional al
valor numérico:

- método utilizado;
- contexto;
- dispositivo;
- momento de medición.

La interpretación clínica depende de la calidad del registro.

---

## CardioSync Impact

### MeasurementContext

Debe representar:

- origen de la medición;
- método;
- condiciones del registro.

---

### BloodPressureRecord

Debe almacenar el dato primario:

- PAS;
- PAD;
- fecha/hora;
- fuente.

No debe almacenar directamente diagnóstico.

---

### ClinicalGuideline

Debe permitir aplicar criterios diferentes según:

- PAC;
- MAPA;
- MDPA.

---

### ClinicalAnalysis

Debe diferenciar:

medición

↓

validación del dato

↓

interpretación clínica

---

## Decision

CardioSync debe evitar tratar todas las mediciones como equivalentes.

Cada registro debe conservar su contexto de obtención.

---

## Traceability

Fuente:

Consenso Argentino de Hipertensión Arterial 2025

Páginas:

10-12

Archivo:

Suplemento6+2025_consensoHTA+2B_avisos-5-64.pdf
