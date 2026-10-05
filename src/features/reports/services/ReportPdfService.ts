import { Directory, File, Paths } from 'expo-file-system'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { AppState } from 'react-native'

import type { BloodPressureReport } from '../models/BloodPressureReport'

import { ReportHtmlService } from './ReportHtmlService'

const REPORT_PDF_DIRECTORY = new Directory(Paths.cache, 'cardiosync-report-pdfs')
const REPORT_PDF_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
const PRINT_RETURN_CLEANUP_DELAY_MS = 60 * 1000
const activePrintUris = new Set<string>()

// Print has no dismissal callback: clean on app return, use a 7-day timer fallback, and sweep stale cache next generation.
function ensureReportPdfDirectory(): Directory {
  REPORT_PDF_DIRECTORY.create({ idempotent: true, intermediates: true })
  return REPORT_PDF_DIRECTORY
}

function isGeneratedReportPdf(file: File): boolean {
  return file.name.startsWith('CardioSync_Reporte_Presion') && file.name.endsWith('.pdf')
}

function cleanExpiredReportPdfs(directory: Directory): void {
  const expiredBefore = Date.now() - REPORT_PDF_MAX_AGE_MS

  for (const entry of directory.list()) {
    if (
      !(entry instanceof File) ||
      !isGeneratedReportPdf(entry) ||
      activePrintUris.has(entry.uri)
    ) {
      continue
    }

    try {
      const modificationTime = entry.info().modificationTime
      if (modificationTime !== undefined && modificationTime < expiredBefore) {
        entry.delete()
      }
    } catch (error) {
      console.warn(`Could not clean expired report PDF ${entry.name}.`, error)
    }
  }
}

function schedulePrintPdfCleanup(uri: string): () => void {
  const file = new File(uri)
  let hasLeftForeground = false
  let cleanupTimer: ReturnType<typeof setTimeout>
  let returnCleanupTimer: ReturnType<typeof setTimeout> | undefined
  let subscription: ReturnType<typeof AppState.addEventListener>
  let cleaned = false

  const cleanup = () => {
    if (cleaned) {
      return
    }

    cleaned = true
    clearTimeout(cleanupTimer)
    if (returnCleanupTimer) {
      clearTimeout(returnCleanupTimer)
    }
    subscription.remove()
    activePrintUris.delete(uri)

    if (file.exists) {
      try {
        file.delete()
      } catch (error) {
        console.warn(`Could not clean temporary report PDF ${file.name}.`, error)
      }
    }
  }

  activePrintUris.add(uri)
  cleanupTimer = setTimeout(cleanup, REPORT_PDF_MAX_AGE_MS)
  subscription = AppState.addEventListener('change', (state) => {
    if (state !== 'active') {
      hasLeftForeground = true
      return
    }

    if (hasLeftForeground) {
      subscription.remove()
      returnCleanupTimer = setTimeout(cleanup, PRINT_RETURN_CLEANUP_DELAY_MS)
    }
  })

  return cleanup
}

function formatFileDate(date: Date): string {
  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, '0')

  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatFileTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')

  const minutes = String(date.getMinutes()).padStart(2, '0')

  const seconds = String(date.getSeconds()).padStart(2, '0')

  const milliseconds = String(date.getMilliseconds()).padStart(3, '0')

  return `${hours}${minutes}${seconds}${milliseconds}`
}

function sanitizeFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function getPeriodFileLabel(report: BloodPressureReport): string {
  switch (report.filter.period) {
    case '7d':
      return '7d'

    case '30d':
      return '30d'

    case '90d':
      return '90d'

    case 'custom': {
      const startDate = report.filter.startDate

      const endDate = report.filter.endDate

      if (startDate && endDate) {
        return `${formatFileDate(startDate)}_${formatFileDate(endDate)}`
      }

      return 'personalizado'
    }
  }
}

function buildFileName(report: BloodPressureReport): string {
  const now = new Date()

  const period = getPeriodFileLabel(report)

  const date = formatFileDate(now)

  const time = formatFileTime(now)

  const patientName = report.patientName?.trim()

  const patientPart = patientName ? `_${sanitizeFileName(patientName)}` : ''

  return (
    `CardioSync_Reporte_Presion` + `${patientPart}_` + `${period}_` + `${date}_` + `${time}.pdf`
  )
}

export class ReportPdfService {
  static async generate(report: BloodPressureReport): Promise<string> {
    const directory = ensureReportPdfDirectory()
    cleanExpiredReportPdfs(directory)
    const html = ReportHtmlService.build(report)

    const result = await Print.printToFileAsync({
      html,
    })

    const generatedFile = new File(result.uri)

    const fileName = buildFileName(report)

    const reportFile = new File(directory, fileName)
    try {
      await generatedFile.move(reportFile)
    } catch (error) {
      if (generatedFile.exists) {
        generatedFile.delete()
      }
      throw error
    }

    return reportFile.uri
  }

  static async share(uri: string): Promise<void> {
    try {
      const available = await Sharing.isAvailableAsync()

      if (!available) {
        throw new Error('La función de compartir no está disponible en este dispositivo.')
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir reporte CardioSync',
        UTI: 'com.adobe.pdf',
      })
    } finally {
      const temporaryFile = new File(uri)

      if (temporaryFile.exists) {
        temporaryFile.delete()
      }
    }
  }

  static async print(uri: string): Promise<void> {
    const cleanup = schedulePrintPdfCleanup(uri)
    try {
      await Print.printAsync({ uri })
    } catch (error) {
      cleanup()
      throw error
    }
  }

  static async generateAndShare(report: BloodPressureReport): Promise<void> {
    const uri = await ReportPdfService.generate(report)

    await ReportPdfService.share(uri)
  }
}
