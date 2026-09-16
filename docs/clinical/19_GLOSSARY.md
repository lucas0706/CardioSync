# Glossary

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir la terminología oficial utilizada por CardioSync en el dominio clínico.

Este documento evita inconsistencias entre:

- documentación;
- arquitectura;
- código;
- interfaz;
- análisis clínico.

---

# 2. BloodPressureRecord

Definición:

Entidad principal que representa una medición de presión arterial registrada
en CardioSync.

Responsabilidad:

Almacenar el evento de medición.

No incluye:

- interpretación clínica;
- clasificación;
- recomendaciones.

---

# 3. ClinicalContext

Definición:

Conjunto de información clínica adicional asociada a una medición específica.

Responsabilidad:

Aportar contexto para interpretación posterior.

No representa:

- paciente completo;
- historia clínica;
- diagnóstico.

---

# 4. MeasurementContext

Definición:

Información relacionada con la forma y condiciones en que fue obtenida una
medición.

Ejemplos:

- posición;
- brazo;
- tipo de medición.

---

# 5. Anthropometry

Definición:

Información relacionada con características corporales.

Incluye:

- peso;
- talla;
- IMC derivado.

---

# 6. VitalSigns

Definición:

Parámetros fisiológicos adicionales asociados temporalmente a una medición.

Incluye:

- frecuencia cardíaca;
- SpO2;
- frecuencia respiratoria.

---

# 7. LifestyleContext

Definición:

Factores recientes del estilo de vida que pueden aportar contexto.

Incluye:

- sueño;
- actividad física;
- ejercicio reciente.

---

# 8. CardiovascularSymptoms

Definición:

Síntomas cardiovasculares asociados temporalmente a una medición.

Incluye:

- dolor torácico;
- disnea;
- palpitaciones.

---

# 9. ClinicalGuideline

Definición:

Representación de una guía clínica seleccionable utilizada para interpretar
mediciones.

Incluye:

- organización;
- versión;
- reglas;
- referencia bibliográfica.

---

# 10. ClinicalAnalysis

Definición:

Resultado de aplicar una guía clínica sobre una medición y su contexto.

No modifica los datos originales.

---

# 11. RecommendationEngine

Definición:

Componente encargado de generar recomendaciones derivadas de análisis
clínicos disponibles.

No prescribe tratamientos.

---

# 12. AlertEngine

Definición:

Componente encargado de comunicar situaciones relevantes mediante alertas.

No realiza diagnósticos.

---

# 13. RiskEngine

Definición:

Componente encargado de evaluar información relacionada con riesgo utilizando
datos clínicos disponibles y reglas definidas.

---

# 14. ClinicalContextBuilder

Definición:

Componente responsable de construir ClinicalContext combinando diferentes
fuentes de información.

---

# 15. ClinicalDataProvider

Definición:

Abstracción que permite obtener datos clínicos desde diferentes fuentes.

Ejemplos:

- manual;
- Health Connect;
- importación.

---

# 16. ContextQualityEngine

Definición:

Componente responsable de evaluar calidad del contexto.

Evalúa:

- completitud;
- vigencia;
- consistencia;
- confianza.

---

# 17. Health Connect

Definición:

Proveedor externo de datos de salud.

CardioSync no depende del proveedor.

El dominio consume información clínica, no tecnología.

---

# 18. Principios terminológicos

Usar:

ClinicalContext

No:

PatientContext


Usar:

ClinicalAnalysis

No:

DiagnosisEngine


Usar:

Recommendation

No:

Prescription


---

# 19. Estado

Draft.

Pendiente:

- revisión final;
- alineación con implementación;
- integración con estándares externos.
