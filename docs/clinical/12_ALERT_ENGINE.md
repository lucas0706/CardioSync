# AlertEngine

**Estado:** motor independiente no implementado en el código auditado el 17-10-2026.

## 1. Concepto

Una alerta comunica información que puede requerir atención del usuario. No es un diagnóstico ni una decisión médica autónoma.

## 2. Estado actual del código

Existe el tipo `ClinicalAlert` en `src/clinical/alerts/ClinicalAlert.ts`, con identificador, título, descripción, severidad y acción. Ese archivo define una interfaz de datos; no implementa por sí solo un motor de evaluación, persistencia, ciclo de vida ni entrega de alertas.

El dominio clínico también contiene `BloodPressureSafetyRule`, que genera un `ClinicalFinding` cuando la presión diastólica media es inferior a 70 mmHg. Ese hallazgo forma parte del análisis clínico y no equivale a un sistema completo de alertas.

## 3. Lo que no debe asumirse

No hay evidencia en el código inspeccionado de un `AlertEngine` independiente que consuma análisis, gestione estados de alerta o notifique automáticamente al usuario. Los tipos conceptuales `MeasurementAlert`, `ContextAlert` y `ClinicalAlert` no deben presentarse como flujos funcionales completos.

## 4. Requisitos antes de implementar

- Definir condiciones y severidad con validación clínica.
- Mantener trazabilidad al dato y a la regla que originan la alerta.
- Evitar alertas duplicadas o mensajes ambiguos.
- Diferenciar claramente información, advertencia y urgencia.
- Definir persistencia, resolución, notificación y pruebas de seguridad.

Las advertencias actuales del análisis deben documentarse como hallazgos de reglas concretas, sin atribuirles capacidades de detección de emergencias.