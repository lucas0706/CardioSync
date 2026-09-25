import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { File } from 'expo-file-system'

import type {
  BloodPressureReport,
} from '../models/BloodPressureReport'

import {
  ReportHtmlService,
} from './ReportHtmlService'

import {
  reportHealthContextBuilder,
} from './ReportHealthContextBuilder'

function formatFileDate(
  date: Date,
): string {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatFileTime(
  date: Date,
): string {
  const hours = String(
    date.getHours(),
  ).padStart(2, '0')

  const minutes = String(
    date.getMinutes(),
  ).padStart(2, '0')

  const seconds = String(
    date.getSeconds(),
  ).padStart(2, '0')

  return `${hours}${minutes}${seconds}`
}

function sanitizeFileName(
  value: string,
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .replace(
      /[^a-zA-Z0-9_-]+/g,
      '_',
    )
    .replace(
      /^_+|_+$/g,
      '',
    )
}

function getPeriodFileLabel(
  report: BloodPressureReport,
): string {
  switch (report.filter.period) {
    case '7d':
      return '7d'

    case '30d':
      return '30d'

    case '90d':
      return '90d'

    case 'custom': {
      const startDate =
        report.filter.startDate

      const endDate =
        report.filter.endDate

      if (
        startDate &&
        endDate
      ) {
        return `${formatFileDate(
          startDate,
        )}_${formatFileDate(
          endDate,
        )}`
      }

      return 'personalizado'
    }
  }
}

function buildFileName(
  report: BloodPressureReport,
): string {
  const now = new Date()

  const period =
    getPeriodFileLabel(report)

  const date =
    formatFileDate(now)

  const time =
    formatFileTime(now)

  const patientName =
    report.patientName?.trim()

  const patientPart =
    patientName
      ? `_${sanitizeFileName(
          patientName,
        )}`
      : ''

  return (
    `CardioSync_Reporte_Presion` +
    `${patientPart}_` +
    `${period}_` +
    `${date}_` +
    `${time}.pdf`
  )
}

export class ReportPdfService {
  static async generate(
    report: BloodPressureReport,
  ): Promise<string> {
    const healthContext =
      await reportHealthContextBuilder.build()

    const reportWithContext: BloodPressureReport =
      {
        ...report,
        healthContext,
      }

    const html =
      ReportHtmlService.build(
        reportWithContext,
      )

    const result =
      await Print.printToFileAsync({
        html,
      })

    const temporaryFile =
      new File(result.uri)

    const fileName =
      buildFileName(
        reportWithContext,
      )

    temporaryFile.rename(
      fileName,
    )

    return temporaryFile.uri
  }

  static async share(
    uri: string,
  ): Promise<void> {
    const available =
      await Sharing.isAvailableAsync()

    if (!available) {
      throw new Error(
        'La función de compartir no está disponible en este dispositivo.',
      )
    }

    try {
      await Sharing.shareAsync(uri, {
        mimeType:
          'application/pdf',
        dialogTitle:
          'Compartir reporte CardioSync',
        UTI:
          'com.adobe.pdf',
      })
    } finally {
      const temporaryFile =
        new File(uri)

      if (
        temporaryFile.exists
      ) {
        temporaryFile.delete()
      }
    }
  }

  static async generateAndShare(
    report: BloodPressureReport,
  ): Promise<void> {
    const uri =
      await ReportPdfService.generate(
        report,
      )

    await ReportPdfService.share(
      uri,
    )
  }
}
