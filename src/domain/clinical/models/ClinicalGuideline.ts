import type { GuidelineSource } from '../types/GuidelineSource'

/**
 * Represents a clinical guideline source.
 *
 * A guideline contains clinical knowledge metadata.
 * It does not execute rules directly.
 *
 * Rules and interpretation belong to ClinicalAnalysis.
 */

export interface ClinicalGuideline {
  // Identity

  id: string

  // Guideline information

  name: string

  organization: string

  version: string

  publicationYear: number

  // Guideline source

  source?: GuidelineSource

  // Source traceability

  sourceDocument?: string

  reference?: string

  // Applicability

  population?: string

  clinicalArea?: string

  // Metadata

  description?: string
}
