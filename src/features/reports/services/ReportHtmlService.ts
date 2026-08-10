import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import type { BloodPressureReport } from '../models/BloodPressureReport'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatNumber(
  value: number,
  decimals = 0,
): string {
  return value.toFixed(decimals)
}

function getPeriodLabel(
  report: BloodPressureReport,
): string {
  switch (report.filter.period) {
    case '7d':
      return 'Últimos 7 días'

    case '30d':
      return 'Últimos 30 días'

    case '90d':
      return 'Últimos 90 días'

    case 'custom':
      if (
        report.filter.startDate &&
        report.filter.endDate
      ) {
        return `${formatDate(
          report.filter.startDate.toISOString(),
        )} - ${formatDate(
          report.filter.endDate.toISOString(),
        )}`
      }

      return 'Período personalizado'
  }
}

function buildPatientSection(
  report: BloodPressureReport,
): string {
  const name = report.patientName
    ? escapeHtml(report.patientName)
    : 'No informado'

  const age =
    report.patientAge !== undefined
      ? `${report.patientAge} años`
      : 'No informada'

  return `
    <section class="patient">
      <h2>Datos personales</h2>

      <div class="patient-grid">
        <div>
          <span class="label">Nombre</span>
          <span class="value">${name}</span>
        </div>

        <div>
          <span class="label">Edad</span>
          <span class="value">${age}</span>
        </div>

        <div>
          <span class="label">Período</span>
          <span class="value">
            ${getPeriodLabel(report)}
          </span>
        </div>

        <div>
          <span class="label">Registros</span>
          <span class="value">
            ${report.records.length}
          </span>
        </div>
      </div>
    </section>
  `
}

function buildSummarySection(
  report: BloodPressureReport,
): string {
  const summary = report.summary

  return `
    <section>
      <h2>Resumen del período</h2>

      <div class="metrics">
        <div class="metric">
          <span class="metric-label">
            Presión arterial promedio
          </span>
          <strong>
            ${formatNumber(summary.averageSystolic)}/
            ${formatNumber(summary.averageDiastolic)}
            mmHg
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Presión máxima
          </span>
          <strong>
            ${summary.maximumSystolic}/
            ${summary.maximumDiastolic}
            mmHg
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Presión mínima
          </span>
          <strong>
            ${summary.minimumSystolic}/
            ${summary.minimumDiastolic}
            mmHg
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Frecuencia cardíaca promedio
          </span>
          <strong>
            ${
              summary.averageHeartRate != null
                ? `${formatNumber(summary.averageHeartRate)} lpm`
                : ''
            }
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Presión arterial media
          </span>
          <strong>
            ${formatNumber(
              summary.meanArterialPressureAverage,
            )}
            mmHg
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Presión de pulso promedio
          </span>
          <strong>
            ${formatNumber(
              summary.pulsePressureAverage,
            )}
            mmHg
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Variabilidad sistólica
          </span>
          <strong>
            ${formatNumber(
              summary.systolicVariability,
              1,
            )}%
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Variabilidad diastólica
          </span>
          <strong>
            ${formatNumber(
              summary.diastolicVariability,
              1,
            )}%
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Carga de hipertensión
          </span>
          <strong>
            ${formatNumber(
              summary.hypertensionLoad,
            )}%
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Tiempo en objetivo
          </span>
          <strong>
            ${formatNumber(
              summary.timeInTarget,
            )}%
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Adherencia
          </span>
          <strong>
            ${formatNumber(
              summary.adherence,
            )}%
          </strong>
        </div>

        <div class="metric">
          <span class="metric-label">
            Tendencia
          </span>
          <strong>
            ${escapeHtml(summary.trend)}
          </strong>
        </div>
      </div>
    </section>
  `
}

function buildBloodPressureChart(
  records: BloodPressureRecord[],
): string {
  if (records.length === 0) {
    return `
      <section class="chart-section">
        <h2>Evolución de la presión arterial</h2>
        <p class="empty">
          No hay registros suficientes para mostrar el gráfico.
        </p>
      </section>
    `
  }

  const sortedRecords = records
    .slice()
    .sort(
      (a, b) =>
        new Date(a.dateTime).getTime() -
        new Date(b.dateTime).getTime(),
    )

  const width = 760
  const height = 300

  const paddingLeft = 48
  const paddingRight = 20
  const paddingTop = 24
  const paddingBottom = 42

  const chartWidth =
    width -
    paddingLeft -
    paddingRight

  const chartHeight =
    height -
    paddingTop -
    paddingBottom

  const values = sortedRecords.flatMap(
    record => [
      record.systolic,
      record.diastolic,
    ],
  )

  const dataMin =
    Math.min(...values)

  const dataMax =
    Math.max(...values)

  const minValue =
    Math.floor(
      Math.min(
        dataMin - 10,
        50,
      ) / 10,
    ) * 10

  const maxValue =
    Math.ceil(
      Math.max(
        dataMax + 10,
        160,
      ) / 10,
    ) * 10

  const valueRange =
    Math.max(
      maxValue - minValue,
      1,
    )

  const getX = (
    index: number,
  ): number => {
    if (sortedRecords.length === 1) {
      return (
        paddingLeft +
        chartWidth / 2
      )
    }

    return (
      paddingLeft +
      (index /
        (sortedRecords.length - 1)) *
        chartWidth
    )
  }

  const getY = (
    value: number,
  ): number =>
    paddingTop +
    chartHeight -
    ((value - minValue) /
      valueRange) *
      chartHeight

  const systolicPoints =
    sortedRecords
      .map(
        (record, index) =>
          `${getX(index).toFixed(1)},${getY(
            record.systolic,
          ).toFixed(1)}`,
      )
      .join(' ')

  const diastolicPoints =
    sortedRecords
      .map(
        (record, index) =>
          `${getX(index).toFixed(1)},${getY(
            record.diastolic,
          ).toFixed(1)}`,
      )
      .join(' ')

  const targetValue = 140

  const targetY =
    targetValue >= minValue &&
    targetValue <= maxValue
      ? getY(targetValue)
      : undefined

  const yStep = 20

  const yTicks: number[] = []

  for (
    let value = minValue;
    value <= maxValue;
    value += yStep
  ) {
    yTicks.push(value)
  }

  const yGrid = yTicks
    .map(value => {
      const y = getY(value)

      return `
        <line
          x1="${paddingLeft}"
          y1="${y.toFixed(1)}"
          x2="${(
            width - paddingRight
          ).toFixed(1)}"
          y2="${y.toFixed(1)}"
          stroke="#E5E7EB"
          stroke-width="1"
        />

        <text
          x="${paddingLeft - 8}"
          y="${(y + 3).toFixed(1)}"
          text-anchor="end"
          font-size="10"
          fill="#6B7280"
        >
          ${value}
        </text>
      `
    })
    .join('')

  const labelStep =
    Math.max(
      1,
      Math.ceil(
        sortedRecords.length / 6,
      ),
    )

  const xLabels = sortedRecords
    .map((record, index) => {
      if (
        index % labelStep !== 0 &&
        index !==
          sortedRecords.length - 1
      ) {
        return ''
      }

      const x = getX(index)
      const date = new Date(
        record.dateTime,
      )

      const label =
        `${String(
          date.getDate(),
        ).padStart(2, '0')}/` +
        `${String(
          date.getMonth() + 1,
        ).padStart(2, '0')}`

      return `
        <text
          x="${x.toFixed(1)}"
          y="${height - 16}"
          text-anchor="middle"
          font-size="9"
          fill="#6B7280"
        >
          ${label}
        </text>
      `
    })
    .join('')

  const targetLine =
    targetY !== undefined
      ? `
        <line
          x1="${paddingLeft}"
          y1="${targetY.toFixed(1)}"
          x2="${(
            width - paddingRight
          ).toFixed(1)}"
          y2="${targetY.toFixed(1)}"
          stroke="#9CA3AF"
          stroke-width="1"
          stroke-dasharray="5 4"
        />

        <text
          x="${width - paddingRight}"
          y="${(
            targetY - 5
          ).toFixed(1)}"
          text-anchor="end"
          font-size="9"
          fill="#6B7280"
        >
          140 mmHg
        </text>
      `
      : ''

  return `
    <section class="chart-section">
      <h2>Evolución de la presión arterial</h2>

      <div class="chart-card">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 ${width} ${height}"
          width="100%"
          height="${height}"
          role="img"
          aria-label="Evolución de presión sistólica y diastólica"
        >
          ${yGrid}

          ${targetLine}

          <polyline
            points="${systolicPoints}"
            fill="none"
            stroke="#D32F2F"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          />

          <polyline
            points="${diastolicPoints}"
            fill="none"
            stroke="#1976D2"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          />

          ${xLabels}

          <line
            x1="${paddingLeft}"
            y1="${paddingTop}"
            x2="${paddingLeft}"
            y2="${(
              height - paddingBottom
            ).toFixed(1)}"
            stroke="#9CA3AF"
            stroke-width="1"
          />

          <line
            x1="${paddingLeft}"
            y1="${(
              height - paddingBottom
            ).toFixed(1)}"
            x2="${(
              width - paddingRight
            ).toFixed(1)}"
            y2="${(
              height - paddingBottom
            ).toFixed(1)}"
            stroke="#9CA3AF"
            stroke-width="1"
          />

          <g>
            <line
              x1="${width - 205}"
              y1="16"
              x2="${width - 185}"
              y2="16"
              stroke="#D32F2F"
              stroke-width="2"
            />

            <text
              x="${width - 180}"
              y="19"
              font-size="10"
              fill="#374151"
            >
              Sistólica
            </text>

            <line
              x1="${width - 110}"
              y1="16"
              x2="${width - 90}"
              y2="16"
              stroke="#1976D2"
              stroke-width="2"
            />

            <text
              x="${width - 85}"
              y="19"
              font-size="10"
              fill="#374151"
            >
              Diastólica
            </text>
          </g>
        </svg>
      </div>

      <p class="chart-note">
        Evolución temporal de los valores sistólicos
        y diastólicos registrados durante el período.
        La línea de referencia corresponde a 140 mmHg
        para la presión sistólica.
      </p>
    </section>
  `
}

function buildRecordsSection(
  records: BloodPressureRecord[],
): string {
  if (records.length === 0) {
    return `
      <section>
        <h2>Registros</h2>
        <p class="empty">
          No hay registros en el período seleccionado.
        </p>
      </section>
    `
  }

  const rows = records
    .slice()
    .sort(
      (a, b) =>
        new Date(b.dateTime).getTime() -
        new Date(a.dateTime).getTime(),
    )
    .map(record => {
      const heartRate =
        record.heartRate != null
          ? `${record.heartRate} lpm`
          : ''

      return `
        <tr>
          <td>
            ${formatDateTime(record.dateTime)}
          </td>

          <td>
            <strong>
              ${record.systolic}/${record.diastolic}
              mmHg
            </strong>
          </td>

          <td>
            ${heartRate}
          </td>
        </tr>
      `
    })
    .join('')

  return `
    <section class="records-section">
      <h2>Registros de presión arterial</h2>

      <table>
        <thead>
          <tr>
            <th>Fecha y hora</th>
            <th>Presión arterial</th>
            <th>Frecuencia cardíaca</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>
    </section>
  `
}

export class ReportHtmlService {
  static build(
    report: BloodPressureReport,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>
            CardioSync - Reporte de presión arterial
          </title>

          <style>
            @page {
              margin: 18mm 14mm;
            }

            body {
              font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Arial,
                sans-serif;
              color: #111827;
              font-size: 11px;
              line-height: 1.45;
            }

            h1 {
              margin: 0;
              font-size: 24px;
            }

            h2 {
              margin: 22px 0 10px;
              font-size: 15px;
              border-bottom: 1px solid #d1d5db;
              padding-bottom: 5px;
            }

            .header {
              margin-bottom: 20px;
              padding-bottom: 12px;
              border-bottom: 2px solid #111827;
            }

            .subtitle {
              margin-top: 4px;
              color: #6b7280;
              font-size: 11px;
            }

            .patient-grid {
              display: grid;
              grid-template-columns:
                repeat(2, 1fr);
              gap: 10px;
            }

            .patient-grid > div {
              padding: 8px;
              background: #f3f4f6;
              border-radius: 5px;
            }

            .label,
            .metric-label {
              display: block;
              color: #6b7280;
              font-size: 9px;
              margin-bottom: 3px;
            }

            .value {
              font-weight: 600;
            }

            .metrics {
              display: grid;
              grid-template-columns:
                repeat(3, 1fr);
              gap: 8px;
            }

            .metric {
              padding: 9px;
              border: 1px solid #e5e7eb;
              border-radius: 5px;
            }

            .metric strong {
              font-size: 12px;
            }

            .chart-section {
              page-break-inside: avoid;
            }

            .chart-card {
              width: 100%;
              margin-top: 8px;
              padding: 6px;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              box-sizing: border-box;
            }

            .chart-card svg {
              display: block;
              width: 100%;
              height: auto;
            }

            .chart-note {
              margin-top: 6px;
              color: #6b7280;
              font-size: 8px;
            }

            .records-section {
              page-break-before: auto;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }

            th,
            td {
              padding: 6px;
              border-bottom: 1px solid #e5e7eb;
              text-align: left;
            }

            th {
              background: #f3f4f6;
              font-size: 9px;
            }

            td {
              font-size: 9px;
            }

            .empty {
              color: #6b7280;
            }

            .footer {
              margin-top: 25px;
              padding-top: 8px;
              border-top: 1px solid #d1d5db;
              color: #6b7280;
              font-size: 8px;
            }
          </style>
        </head>

        <body>
          <header class="header">
            <h1>CardioSync</h1>

            <div class="subtitle">
              Reporte de seguimiento de
              presión arterial
            </div>
          </header>

          ${buildPatientSection(report)}

          ${buildSummarySection(report)}

          ${buildBloodPressureChart(
            report.records,
          )}

          ${buildRecordsSection(
            report.records,
          )}

          <footer class="footer">
            Este documento resume los registros
            ingresados en CardioSync durante el
            período seleccionado. Los datos deben
            interpretarse en el contexto clínico
            correspondiente.
          </footer>
        </body>
      </html>
    `
  }
}
