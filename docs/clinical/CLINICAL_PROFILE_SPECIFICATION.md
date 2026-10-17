# Especificación del perfil clínico

**Estado:** contrastado con `ProfileScreen`, `ClinicalProfileService`, `ClinicalProfileRepository` y `ClinicalContext` el 17-10-2026.

## 1. Propósito

El perfil local almacena información opcional a nivel de paciente que puede utilizarse para contextualizar el seguimiento de presión arterial. No reemplaza los registros de medición ni representa una historia clínica completa.

## 2. Implementación disponible

- Interfaz de usuario: `src/features/profile/screens/ProfileScreen.tsx`.
- Contrato: `src/domain/clinical/models/ClinicalContext.ts`.
- Servicio: `src/features/profile/services/ClinicalProfileService.ts`.
- Persistencia: `src/core/database/ClinicalProfileRepository.ts`, sobre la tabla SQLite `clinical_profile`.
- Identificador local: `LOCAL_PROFILE_ID = 'local-user'`.
- El perfil permite nombre, edad, sexo, altura, peso inicial, IMC, tabaquismo, diabetes, dislipidemia y antecedentes cardiovasculares/renales.
- El IMC se calcula desde altura en centímetros y peso en kilogramos y se redondea a un decimal.

Por lo tanto, la interfaz y la persistencia del perfil **sí están implementadas**; la versión anterior de este documento que las marcaba como pendientes estaba desactualizada.

## 3. Relación con Clinical Analysis

El contrato de `ClinicalAnalysisDomainService` recibe `ClinicalContext`, y las reglas de objetivos y factores asociados al riesgo consumen campos del contexto. Sin embargo, en el código inspeccionado, el único consumidor de `ClinicalAnalysisDomainService.analyze()` identificado de forma directa es el escenario de desarrollo `src/devtools/clinical/ClinicalHistoricalScenario.ts`.

No se confirmó una integración de producción que cargue el perfil guardado, calcule estadísticas del periodo seleccionado y entregue ambos al servicio de análisis desde una pantalla o flujo normal de la aplicación. Por ello, la existencia del perfil no debe confundirse con una integración productiva completa del análisis contextual.

## 4. Datos fuera del perfil

Los valores de una medición específica —PAS, PAD, fecha/hora, frecuencia cardíaca, brazo, posición, notas y metadata del evento— pertenecen al registro. El contrato actual conserva algunos campos heredados adicionales en `BloodPressureRecord`; su separación sigue pendiente.

## 5. Health Connect

Health Connect tiene servicios y mapeadores propios. No se debe asumir que peso actual, sueño, actividad, pasos o frecuencia cardíaca se fusionan automáticamente con el perfil local o se pasan al análisis clínico.

## 6. Límites de diseño

- No copiar el perfil dentro de cada registro de presión arterial.
- No inferir diagnósticos a partir de campos del perfil.
- No tratar la edad o las condiciones ausentes como datos clínicos confirmados.
- No describir el análisis contextual como integrado en producción hasta localizar y probar el flujo de consumo.
- Si se amplía el perfil, mantener un único contrato de dominio y migraciones SQLite compatibles.