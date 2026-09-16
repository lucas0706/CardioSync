import type {
  BloodPressureReport,
} from '../models/BloodPressureReport'

import {
  buildReportRedesignV1,
} from '@/features/reports/renderers/ReportRedesignV1'

export class ReportHtmlService {
  static build(
    report: BloodPressureReport,
  ): string {
    return buildReportRedesignV1(
      report,
    )
  }
}
