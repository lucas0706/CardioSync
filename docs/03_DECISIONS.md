# CardioSync — Architecture Decision Records (ADR)

| Campo | Valor |
|-------|--------|
| Documento | 03_DECISIONS.md |
| Tipo | Architecture Decision Records |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# Objetivo

Este documento registra todas las decisiones arquitectónicas relevantes tomadas durante la evolución de CardioSync.

Su finalidad es:

- Preservar el conocimiento del proyecto.
- Evitar volver a discutir decisiones ya tomadas.
- Comprender el motivo de cada decisión.
- Facilitar futuras refactorizaciones.
- Ayudar a diagnosticar errores arquitectónicos.
- Identificar rápidamente el origen de posibles problemas.

---

# Cómo utilizar este documento

Cada decisión se registra mediante un Architecture Decision Record (ADR).

Cada ADR deberá contener como mínimo:

- ID
- Fecha
- Estado
- Contexto
- Problema
- Decisión
- Justificación
- Alternativas descartadas
- Consecuencias
- Qué puede romper esta decisión
- Síntomas
- Cómo diagnosticar el problema
- Archivos afectados
- Documentos relacionados

---

# Estados

| Estado | Significado |
|---------|-------------|
| Activa | La decisión continúa vigente. |
| Reemplazada | Existe una decisión más reciente. |
| Obsoleta | Ya no aplica al proyecto. |

---

# Índice de decisiones

Las decisiones se documentarán utilizando el siguiente formato:

- ADR-001
- ADR-002
- ADR-003
- ADR-004
- ...

Cada nueva decisión deberá agregarse al final del documento respetando la numeración correlativa.



---

# ADR-002

## Título

Los formatos externos se adaptan mediante mappers.

---

## Fecha

2026-08-03

---

## Estado

Activa

---

## Contexto

CardioSync podrá recibir información histórica proveniente de diferentes fuentes externas.

Estas fuentes pueden utilizar:

- Distintos nombres de campos.
- Diferentes formatos de fecha.
- Diferentes estructuras de archivos.
- Diferentes modelos de datos.

Ejemplos:

- CSV.
- Excel.
- Exportaciones de otras aplicaciones.
- Registros personales.

---

## Problema

Modificar el modelo interno de CardioSync para adaptarlo a cada formato externo generaría:

- Alto acoplamiento.
- Entidades demasiado grandes.
- Dificultad de mantenimiento.
- Dependencia de proveedores externos.

---

## Decisión

CardioSync mantendrá un modelo interno propio.

Los formatos externos serán transformados mediante capas específicas:

- Parser.
- Validator.
- Normalizer.
- Mapper.

El resultado final será convertido al modelo interno de CardioSync.

---

## Flujo definido

Fuente externa

↓

Import Layer

↓

Validación

↓

Mapper

↓

BloodPressureRecord

↓

Repository

↓

Database

---

## Justificación

Esta decisión permite:

- Importar históricos de múltiples fuentes.
- Mantener estable el dominio.
- Incorporar nuevos formatos sin modificar entidades principales.
- Separar datos externos del modelo interno.

---

## Consecuencias positivas

- Mayor compatibilidad.
- Mejor mantenibilidad.
- Menor acoplamiento.
- Evolución independiente del dominio.

---

## Consecuencias negativas

- Cada nuevo formato puede requerir un mapper específico.
- Se debe mantener lógica adicional de transformación.

---

## Qué puede romper esta decisión

Modificar:

- BloodPressureRecord.
- Measurement Domain.
- Entidades principales.

para adaptarlas a un archivo externo específico.

---

## Síntomas cuando se rompe

- Muchas propiedades opcionales.
- Modelos difíciles de mantener.
- Dependencias con aplicaciones externas.
- Aumento de complejidad en el dominio.

---

## Diagnóstico

Si una nueva integración requiere modificar entidades centrales, revisar este ADR antes de realizar cambios.

---

## Documentos relacionados

- 09_DATABASE.md
- 01_ARCHITECTURE.md
- 04_CLINICAL_DOMAIN.md

