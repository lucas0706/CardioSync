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


---

# ADR-003

## Título

Separación entre la medición y el contexto clínico

---

## Fecha

2026-08-05

---

## Estado

Activa

---

## Contexto

Durante la Fase 5 se realizó una auditoría completa del dominio de CardioSync.

La auditoría mostró que `BloodPressureRecord` había acumulado información perteneciente a distintos dominios:

- Medición.
- Contexto clínico.
- Antropometría.
- Oxigenación.
- Medicación.
- Síntomas.
- Datos heredados de versiones anteriores.

Esta mezcla dificulta la evolución del dominio y aumenta el acoplamiento entre la medición y la información clínica complementaria.

---

## Problema

`BloodPressureRecord` debe representar exclusivamente una medición de presión arterial.

Toda la información adicional pertenece al contexto clínico del paciente y no a la medición en sí.

Mantener ambos conceptos dentro de la misma entidad dificulta:

- La evolución del dominio.
- La implementación de ClinicalContext.
- La implementación de ClinicalRuleEngine.
- La implementación de ClinicalAnalysisEngine.
- El mantenimiento del modelo.

---

## Decisión

CardioSync separará conceptualmente ambos dominios.

### BloodPressureRecord

Representará únicamente la medición.

Ejemplos:

- Fecha y hora.
- Presión sistólica.
- Presión diastólica.
- Frecuencia cardíaca.
- Brazo.
- Posición.
- Notas.

### ClinicalContext

Representará información clínica opcional asociada a una medición.

Ejemplos:

- Peso.
- Altura.
- IMC.
- Saturación de oxígeno.
- Frecuencia respiratoria.
- Medicación.
- Síntomas cardiovasculares.

ClinicalContext no se implementará durante la Fase 5.

La Fase 5 únicamente prepara el dominio para dicha separación.

---

## Justificación

Esta decisión:

- Reduce el acoplamiento.
- Simplifica BloodPressureRecord.
- Facilita futuras refactorizaciones.
- Evita mezclar conceptos diferentes dentro de una misma entidad.
- Permite que ClinicalContext evolucione de forma independiente.

---

## Alternativas descartadas

Mantener toda la información clínica dentro de BloodPressureRecord.

Se descartó por generar un modelo demasiado grande, difícil de mantener y poco alineado con la arquitectura prevista para las siguientes fases.

---

## Consecuencias

Positivas:

- Dominio más claro.
- Mejor separación de responsabilidades.
- Base sólida para ClinicalRuleEngine.
- Base sólida para ClinicalAnalysisEngine.
- Mejor preparación para futuras integraciones.

Negativas:

- Será necesaria una migración controlada cuando se implemente ClinicalContext.

---

## Qué puede romper esta decisión

- Volver a incorporar información clínica directamente en BloodPressureRecord.
- Utilizar BloodPressureRecord como historia clínica general.

---

## Síntomas

- Aparición de numerosos campos opcionales.
- Mezcla de información de la medición con información del paciente.
- Crecimiento excesivo de BloodPressureRecord.

---

## Diagnóstico

Si un nuevo dato describe el estado del paciente y no la medición de presión arterial, debe evaluarse primero si pertenece a ClinicalContext antes de agregarse al dominio principal.

---

## Archivos afectados

- src/domain/measurements/BloodPressureRecord.ts
- src/core/database/BloodPressureRepository.ts
- src/core/database/init.ts
- docs/13_DOMAIN_REFACTOR.md

---

## Documentos relacionados

- 00_PROJECT_MASTER_CONTEXT.md
- 01_ARCHITECTURE.md
- 02_ROADMAP.md
- 04_CLINICAL_DOMAIN.md
- 13_DOMAIN_REFACTOR.md

