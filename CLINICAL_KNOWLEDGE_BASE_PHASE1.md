Actúa como arquitecto principal de CardioSync.

NO escribas código.

Objetivo:

Completar la primera parte de la Clinical Knowledge Base utilizando EXCLUSIVAMENTE las siguientes guías clínicas del proyecto:

- Consenso Argentino de Hipertensión Arterial 2025
- ESC Guidelines 2024
- AHA/ACC Guideline 2025
- ISH Global Hypertension Practice Guidelines 2020

Trabaja únicamente sobre documentación.

Completa completamente los siguientes documentos:

docs/clinical/

03_CLINICAL_CONTEXT.md

04_MEASUREMENT_CONTEXT.md

05_ANTHROPOMETRY.md

06_VITAL_SIGNS.md

07_CARDIOVASCULAR_SYMPTOMS.md

Cada documento debe seguir exactamente esta estructura:

# Objetivo

# Evidencia de las guías

Comparar las cuatro guías.

No resumir.

Extraer únicamente aquello que sea relevante para CardioSync.

# Comparación entre guías

Crear tablas cuando sea necesario.

Identificar similitudes.

Identificar diferencias.

# Decisiones arquitectónicas

Explicar qué impacto tienen sobre CardioSync.

Justificar cada decisión.

# Modelo del dominio

Proponer entidades.

Proponer Value Objects.

Proponer Enumeraciones.

Proponer relaciones.

NO escribir código.

Solo especificación.

# ADR derivados

Agregar las Architecture Decision Records que surjan.

# Impacto en CardioSync

Explicar qué módulos utilizarán esta información.

# Riesgos

Identificar riesgos de implementación.

# Decisiones congeladas

Finalizar cada documento indicando qué decisiones quedan oficialmente congeladas.

Reglas obligatorias:

- No modificar código.
- No crear dependencias.
- No cambiar la arquitectura existente.
- No inventar información clínica.
- Basarse únicamente en las cuatro guías.
- Mantener BloodPressureRecord como núcleo del dominio.
- ClinicalContext representa únicamente el contexto de una medición.
- ClinicalAnalysis permanece separado.
- ClinicalGuideline permanece separado.

El resultado debe ser una especificación de ingeniería clínica, no un resumen médico.
