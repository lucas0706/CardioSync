/**
 * Phase 5 – Domain Refactor
 *
 * This file documents the conceptual grouping of BloodPressureRecord fields.
 *
 * It is intentionally independent from the implementation so future phases
 * (ClinicalContext, ClinicalRuleEngine and ClinicalAnalysisEngine) can evolve
 * without modifying the current measurement flow.
 */

export const BLOOD_PRESSURE_CORE_FIELDS = [
  'id',
  'dateTime',
  'systolic',
  'diastolic',
  'heartRate',
  'arm',
  'position',
  'notes',
  'createdAt',
  'updatedAt',
] as const

export const CLINICAL_CONTEXT_CANDIDATE_FIELDS = [
  'weight',
  'height',
  'bmi',
  'glucose',
  'spo2',
  'temperature',
  'respiratoryRate',
  'pain',
] as const

export const ANALYSIS_METADATA_FIELDS = [
  'guideline',
] as const
