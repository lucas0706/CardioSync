# Síntomas cardiovasculares

**Estado:** concepto documentado; modelo independiente no implementado en `feature/app-updates` (revisión del 17-10-2026).

## 1. Objetivo conceptual

Los síntomas pueden aportar información relevante sobre el estado de una persona, pero no constituyen por sí mismos un diagnóstico. Deben conservarse con una referencia temporal y no asociarse automáticamente a mediciones posteriores.

## 2. Estado del código

No existe actualmente un modelo `CardiovascularSymptoms` en `src/domain/clinical/models`. El contrato `BloodPressureRecord` conserva un campo numérico opcional `pain`, pero no representa de forma estructurada presencia, duración, intensidad, temporalidad o tipo de síntoma.

Tampoco se encontró una integración de estos síntomas en `ClinicalAnalysisDomainService` ni una regla de análisis que consuma un modelo de síntomas.

## 3. Conceptos propuestos, no implementados

El dolor torácico, la disnea, las palpitaciones y los síntomas neurológicos asociados pueden requerir modelos específicos. No deben presentarse como campos o flujos disponibles en la aplicación hasta que exista implementación y persistencia explícitas.

## 4. Límites de seguridad

- No convertir un síntoma en diagnóstico.
- No inferir síntomas a partir de la presión arterial.
- No afirmar que existe detección automática de emergencias.
- Si se implementan advertencias de seguridad, deben tener criterios claros, trazabilidad y mensajes validados clínicamente.

## 5. Próxima implementación

Antes de introducir este dominio deben definirse el esquema, la temporalidad, el almacenamiento, la importación/exportación, las reglas de seguridad y las pruebas. Este documento no autoriza por sí solo a implementar ni a diagnosticar.