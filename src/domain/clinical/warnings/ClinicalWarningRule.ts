/**
 * Represents a clinical safety warning.
 *
 * Warnings do not diagnose conditions.
 * They identify situations that require attention
 * when interpreting measurements.
 */

export interface ClinicalWarningRule {

  /**
   * Unique identifier.
   */
  id: string


  /**
   * Clinical condition required to evaluate
   * this warning.
   */
  condition?: string


  /**
   * Warning severity.
   */
  severity:
    | 'info'
    | 'caution'
    | 'critical'


  /**
   * Human-readable explanation.
   */
  message: string
}
