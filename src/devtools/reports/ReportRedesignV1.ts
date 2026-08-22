import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { BloodPressureClassifier } from '@/domain/clinical/classification'
import type { BloodPressureReport } from '@/features/reports/models/BloodPressureReport'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatNumber(
  value: number | undefined,
  decimals = 0,
): string {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return '—'
  }

  return value.toFixed(decimals)
}

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return (
    `${String(date.getDate()).padStart(2, '0')}/` +
    `${String(date.getMonth() + 1).padStart(2, '0')}/` +
    `${date.getFullYear()}`
  )
}

function formatDateTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return (
    `${formatDate(value)} ` +
    `${String(date.getHours()).padStart(2, '0')}:` +
    `${String(date.getMinutes()).padStart(2, '0')}`
  )
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

    default:
      return 'Período seleccionado'
  }
}

function getClassificationLabel(
  classification: string | undefined,
): string {
  switch (classification) {
    case 'normal':
      return 'Normal'

    case 'borderline':
      return 'Limítrofe'

    case 'grade-1':
      return 'Hipertensión arterial nivel 1'

    case 'grade-2':
      return 'Hipertensión arterial nivel 2'

    case 'isolated-systolic':
      return 'Hipertensión sistólica aislada'

    default:
      return classification
        ? classification
        : 'No disponible'
  }
}

function getRecordClassification(
  record: BloodPressureRecord,
): {
  category: string
  label: string
} {
  const classification =
    BloodPressureClassifier.classify(
      record.systolic,
      record.diastolic,
    )

  return {
    category: classification.category,
    label: classification.label,
  }
}

function getClassificationClass(
  category: string,
): string {
  switch (category) {
    case 'normal':
      return 'normal'

    case 'borderline':
      return 'borderline'

    case 'grade-1':
      return 'grade1'

    case 'grade-2':
      return 'grade2'

    case 'isolated-systolic':
      return 'isolated-systolic'

    default:
      return 'unknown'
  }
}

function buildTrendChart(
  report: BloodPressureReport,
): string {
  const records = [...report.records].sort(
    (a, b) =>
      new Date(a.dateTime).getTime() -
      new Date(b.dateTime).getTime(),
  )

  if (records.length === 0) {
    return `
      <div class="empty chart-empty">
        No hay mediciones para mostrar.
      </div>
    `
  }

  const width = 760
  const height = 250
  const paddingLeft = 42
  const paddingRight = 20
  const paddingTop = 24
  const paddingBottom = 36

  const plotWidth =
    width - paddingLeft - paddingRight

  const plotHeight =
    height - paddingTop - paddingBottom

  const values = records.flatMap(record => [
    record.systolic,
    record.diastolic,
  ])

  const minValue =
    Math.floor(
      (Math.min(...values) - 10) / 10,
    ) * 10

  const maxValue =
    Math.ceil(
      (Math.max(...values) + 10) / 10,
    ) * 10

  const valueRange =
    Math.max(maxValue - minValue, 20)

  const getX = (index: number): number => {
    if (records.length === 1) {
      return paddingLeft + plotWidth / 2
    }

    return (
      paddingLeft +
      (index / (records.length - 1)) *
        plotWidth
    )
  }

  const getY = (value: number): number =>
    paddingTop +
    ((maxValue - value) / valueRange) *
      plotHeight

  const buildPath = (
    selector: (
      record: BloodPressureRecord,
    ) => number,
  ): string =>
    records
      .map(
        (record, index) =>
          `${index === 0 ? 'M' : 'L'} ` +
          `${getX(index).toFixed(1)} ` +
          `${getY(selector(record)).toFixed(1)}`,
      )
      .join(' ')

  const gridLines = Array.from(
    { length: 5 },
    (_, index) => {
      const value =
        maxValue -
        (index * valueRange) / 4

      const y = getY(value)

      return `
        <line
          x1="${paddingLeft}"
          y1="${y}"
          x2="${width - paddingRight}"
          y2="${y}"
          class="chart-grid"
        />

        <text
          x="${paddingLeft - 8}"
          y="${y + 4}"
          text-anchor="end"
          class="chart-label"
        >
          ${Math.round(value)}
        </text>
      `
    },
  ).join('')

  const systolicPoints = records
    .map(
      (record, index) => `
        <circle
          cx="${getX(index)}"
          cy="${getY(record.systolic)}"
          r="2.8"
          class="point-systolic"
        />
      `,
    )
    .join('')

  const diastolicPoints = records
    .map(
      (record, index) => `
        <circle
          cx="${getX(index)}"
          cy="${getY(record.diastolic)}"
          r="2.8"
          class="point-diastolic"
        />
      `,
    )
    .join('')

  const xLabels = records
    .map((record, index) => {
      if (
        records.length > 8 &&
        index !== 0 &&
        index !== records.length - 1 &&
        index %
          Math.ceil(records.length / 6) !==
          0
      ) {
        return ''
      }

      return `
        <text
          x="${getX(index)}"
          y="${height - 10}"
          text-anchor="middle"
          class="chart-label"
        >
          ${escapeHtml(
            formatDate(record.dateTime),
          )}
        </text>
      `
    })
    .join('')

  return `
    <div class="chart-wrapper">
      <div class="chart-legend">
        <span>
          <i class="legend-dot systolic"></i>
          Sistólica
        </span>

        <span>
          <i class="legend-dot diastolic"></i>
          Diastólica
        </span>
      </div>

      <svg
        viewBox="0 0 ${width} ${height}"
        class="chart"
        role="img"
        aria-label="Evolución de presión sistólica y diastólica"
      >
        ${gridLines}

        <path
          d="${buildPath(
            record => record.systolic,
          )}"
          class="line-systolic"
          fill="none"
        />

        <path
          d="${buildPath(
            record => record.diastolic,
          )}"
          class="line-diastolic"
          fill="none"
        />

        ${systolicPoints}
        ${diastolicPoints}
        ${xLabels}
      </svg>
    </div>
  `
}

function buildClassificationCards(
  report: BloodPressureReport,
): string {
  const distribution = Object.entries(
    report.summary.classificationDistribution ?? {},
  )

  if (distribution.length === 0) {
    return `
      <div class="empty">
        No hay datos de clasificación disponibles.
      </div>
    `
  }

  const total =
    report.summary.totalMeasurements || 1

  return distribution
    .sort((a, b) => b[1] - a[1])
    .map(([classification, count]) => {
      const percentage =
        (count / total) * 100

      return `
        <div class="classification-card">
          <div class="classification-card-top">
            <span class="classification-name">
              ${escapeHtml(
                getClassificationLabel(
                  classification,
                ),
              )}
            </span>

            <strong>${count}</strong>
          </div>

          <div class="progress-track">
            <div
              class="progress-fill"
              style="width: ${Math.min(
                percentage,
                100,
              ).toFixed(1)}%"
            ></div>
          </div>

          <span class="classification-percent">
            ${percentage.toFixed(0)}%
          </span>
        </div>
      `
    })
    .join('')
}

function buildMeasurementRows(
  report: BloodPressureReport,
): string {
  const records = [...report.records].sort(
    (a, b) =>
      new Date(b.dateTime).getTime() -
      new Date(a.dateTime).getTime(),
  )

  if (records.length === 0) {
    return `
      <tr>
        <td colspan="4" class="empty">
          No hay registros en el período seleccionado.
        </td>
      </tr>
    `
  }

  return records
    .map(record => {
      const classification =
        getRecordClassification(record)

      return `
        <tr>
          <td>
            ${formatDateTime(record.dateTime)}
          </td>

          <td class="pressure">
            ${record.systolic}/${record.diastolic}
            <small>mmHg</small>
          </td>

          <td>
            ${
              record.heartRate !== undefined
                ? formatNumber(
                    record.heartRate,
                  )
                : '—'
            }
            <small>lpm</small>
          </td>

          <td>
            <span class="classification ${getClassificationClass(
              classification.category,
            )}">
              ${escapeHtml(
                classification.label,
              )}
            </span>
          </td>
        </tr>
      `
    })
    .join('')
}

export function buildReportRedesignV1(
  report: BloodPressureReport,
): string {
  const { summary } = report

  const periodLabel =
    getPeriodLabel(report)

  const trendLabel =
    summary.trend === 'up'
      ? 'En aumento'
      : summary.trend === 'down'
        ? 'En descenso'
        : 'Estable'

  const predominant =
    summary.predominantClassification
      ? getClassificationLabel(
          summary.predominantClassification,
        )
      : 'No disponible'

  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<style>
@page {
  size: A4 portrait;
  margin: 10mm;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #eef2f1;
  color: #172033;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

body {
  padding: 8px;
}

.page {
  width: 100%;
  max-width: none;
  margin: 0;
}

.header,
.section {
  background: #ffffff;
  border: 1px solid #dce4e1;
  border-radius: 18px;
}

.header {
  padding: 24px;
  margin-bottom: 16px;
}

.brand {
  color: #176b57;
  font-size: 26px;
  font-weight: 800;
}

.title {
  margin-top: 4px;
  font-size: 21px;
  font-weight: 700;
}

.patient {
  margin-top: 14px;
  font-size: 15px;
  color: #526174;
}

.period {
  margin-top: 4px;
  font-size: 13px;
  color: #6b7787;
}

.section {
  padding: 18px 20px;
  margin-bottom: 12px;
}

.section-title {
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 750;
}

.primary-grid,
.metric-grid,
.indicator-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.primary-card {
  padding: 14px;
  border-radius: 13px;
  background: #f3f7f5;
}

.primary-label,
.metric-label,
.indicator-label {
  font-size: 11px;
  color: #687585;
}

.primary-value {
  margin-top: 5px;
  font-size: 23px;
  font-weight: 800;
}

.primary-unit,
.metric-unit {
  margin-left: 4px;
  font-size: 11px;
  color: #687585;
}

.metric,
.indicator {
  padding: 11px;
  border-radius: 11px;
  background: #f7f9f8;
}

.metric-value,
.indicator-value {
  margin-top: 4px;
  font-size: 17px;
  font-weight: 750;
}

.classification-grid {
  display: grid;
  gap: 9px;
}

.classification-card {
  padding: 12px;
  border-radius: 12px;
  background: #f7f9f8;
}

.classification-card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.classification-name {
  flex: 1;
  min-width: 0;
  font-weight: 650;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.classification-card-top strong {
  flex-shrink: 0;
  min-width: 24px;
  text-align: right;
}



.classification-percent {
  display: block;
  margin-top: 4px;
  font-size: 10px;
  color: #687585;
}

.progress-track {
  height: 6px;
  margin-top: 6px;
  overflow: hidden;
  border-radius: 99px;
  background: #e4eae7;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: #26876f;
}

.chart-wrapper {
  width: 100%;
  overflow: hidden;
}

.chart {
  display: block;
  width: 100%;
  height: auto;
}

.chart-grid {
  stroke: #e2e8e5;
  stroke-width: 1;
}

.chart-label {
  fill: #7a8491;
  font-size: 10px;
}

.line-systolic {
  stroke: #176b57;
  stroke-width: 2.8;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.line-diastolic {
  stroke: #718096;
  stroke-width: 2.5;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.point-systolic {
  fill: #176b57;
}

.point-diastolic {
  fill: #718096;
}

.chart-legend {
  display: flex;
  gap: 18px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #526174;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
}

.legend-dot.systolic {
  background: #176b57;
}

.legend-dot.diastolic {
  background: #718096;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th {
  padding: 9px 7px;
  text-align: left;
  color: #687585;
  font-weight: 650;
  border-bottom: 1px solid #dce4e1;
}

td {
  padding: 9px 7px;
  border-bottom: 1px solid #edf1ef;
  vertical-align: middle;
}

.pressure {
  font-weight: 750;
}

small {
  font-size: 9px;
  color: #7a8491;
}

.classification {
  display: inline-block;
  padding: 4px 7px;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 650;
}

.classification.normal {
  background: #e5f3ed;
  color: #176b57;
}

.classification.borderline {
  background: #f6f0dd;
  color: #80691d;
}

.classification.grade1 {
  background: #fde4dc;
  color: #b33a24;
  font-weight: 750;
}

.classification.grade2 {
  background: #f8d2d2;
  color: #a51f1f;
  font-weight: 750;
}

.classification.isolated-systolic {
  background: #eee5ff;
  color: #6d28a9;
  font-weight: 750;
}

.classification.unknown {
  background: #edf0f2;
  color: #5f6975;
}

.empty {
  padding: 18px;
  text-align: center;
  color: #7a8491;
}

.chart-empty {
  background: #f7f9f8;
  border-radius: 12px;
}

.footer {
  padding: 8px 4px 20px;
  text-align: center;
  color: #7a8491;
  font-size: 10px;
  line-height: 15px;
}

@media (max-width: 600px) {
  body {
    padding: 10px;
  }

  .primary-grid,
  .metric-grid,
  .indicator-grid {
    grid-template-columns: 1fr;
  }
}
</style>
</head>

<body>
<div class="page">

<header class="header">
  <div class="brand">CardioSync</div>

  <div class="title">
    Reporte de presión arterial
  </div>

  <div class="patient">
    ${
      report.patientName
        ? `Paciente: ${escapeHtml(
            report.patientName,
          )}`
        : 'Paciente: No configurado'
    }

    ${
      report.patientAge !== undefined
        ? ` · ${report.patientAge} años`
        : ''
    }
  </div>

  <div class="period">
    Período analizado:
    ${escapeHtml(periodLabel)}
    · ${summary.totalMeasurements} mediciones
  </div>
</header>

<section class="section">
  <h2 class="section-title">
    Resumen principal
  </h2>

  <div class="primary-grid">

    <div class="primary-card">
      <div class="primary-label">
        Presión promedio
      </div>

      <div class="primary-value">
        ${Math.round(summary.averageSystolic)}/
        ${Math.round(summary.averageDiastolic)}
        <span class="primary-unit">mmHg</span>
      </div>
    </div>

    <div class="primary-card">
      <div class="primary-label">
        Frecuencia cardíaca promedio
      </div>

      <div class="primary-value">
        ${
          summary.averageHeartRate !== undefined
            ? Math.round(
                summary.averageHeartRate,
              )
            : '—'
        }
        <span class="primary-unit">lpm</span>
      </div>
    </div>

    <div class="primary-card">
      <div class="primary-label">
        Presión arterial media
      </div>

      <div class="primary-value">
        ${Math.round(
          summary.meanArterialPressureAverage,
        )}
        <span class="primary-unit">mmHg</span>
      </div>
    </div>

    <div class="primary-card">
      <div class="primary-label">
        Presión de pulso
      </div>

      <div class="primary-value">
        ${Math.round(
          summary.pulsePressureAverage,
        )}
        <span class="primary-unit">mmHg</span>
      </div>
    </div>

  </div>
</section>

<section class="section">
  <h2 class="section-title">
    Evolución de la presión
  </h2>

  ${buildTrendChart(report)}
</section>

<section class="section">
  <h2 class="section-title">
    Clasificación de las mediciones
  </h2>

  <div class="classification-grid">
    ${buildClassificationCards(report)}
  </div>

  <div class="metric" style="margin-top: 10px;">
    <div class="metric-label">
      Clasificación más frecuente
    </div>

    <div class="metric-value">
      ${escapeHtml(predominant)}
    </div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">
    Indicadores del período
  </h2>

  <div class="indicator-grid">

    <div class="indicator">
      <div class="indicator-label">
        Mediciones dentro del objetivo
      </div>

      <div class="indicator-value">
        ${summary.timeInTarget.toFixed(0)}%
      </div>
    </div>

    <div class="indicator">
      <div class="indicator-label">
        Mediciones con presión elevada
      </div>

      <div class="indicator-value">
        ${summary.hypertensionLoad.toFixed(0)}%
      </div>
    </div>

    <div class="indicator">
      <div class="indicator-label">
        Regularidad de registros
      </div>

      <div class="indicator-value">
        ${summary.adherence.toFixed(0)}%
      </div>
    </div>

    <div class="indicator">
      <div class="indicator-label">
        Tendencia
      </div>

      <div class="indicator-value">
        ${trendLabel}
      </div>
    </div>

  </div>
</section>

<section class="section">
  <h2 class="section-title">
    Valores y variabilidad
  </h2>

  <div class="metric-grid">

    <div class="metric">
      <div class="metric-label">
        Valor máximo
      </div>

      <div class="metric-value">
        ${summary.maximumSystolic}/
        ${summary.maximumDiastolic}
        <span class="metric-unit">mmHg</span>
      </div>
    </div>

    <div class="metric">
      <div class="metric-label">
        Valor mínimo
      </div>

      <div class="metric-value">
        ${summary.minimumSystolic}/
        ${summary.minimumDiastolic}
        <span class="metric-unit">mmHg</span>
      </div>
    </div>

    <div class="metric">
      <div class="metric-label">
        Desviación estándar sistólica
      </div>

      <div class="metric-value">
        ${formatNumber(
          summary.systolicStandardDeviation,
          1,
        )}
      </div>
    </div>

    <div class="metric">
      <div class="metric-label">
        Desviación estándar diastólica
      </div>

      <div class="metric-value">
        ${formatNumber(
          summary.diastolicStandardDeviation,
          1,
        )}
      </div>
    </div>

    <div class="metric">
      <div class="metric-label">
        Variabilidad sistólica
      </div>

      <div class="metric-value">
        ${formatNumber(
          summary.systolicVariability,
          1,
        )}%
      </div>
    </div>

    <div class="metric">
      <div class="metric-label">
        Variabilidad diastólica
      </div>

      <div class="metric-value">
        ${formatNumber(
          summary.diastolicVariability,
          1,
        )}%
      </div>
    </div>

  </div>
</section>

<section class="section">
  <h2 class="section-title">
    Mediciones registradas
  </h2>

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Fecha y hora</th>
          <th>Presión</th>
          <th>FC</th>
          <th>Clasificación</th>
        </tr>
      </thead>

      <tbody>
        ${buildMeasurementRows(report)}
      </tbody>
    </table>
  </div>
</section>

<footer class="footer">
  Las métricas se calculan exclusivamente a partir
  de las mediciones registradas durante el período
  seleccionado.

  <br /><br />

  La regularidad de registros describe únicamente
  las mediciones disponibles en CardioSync.
  No representa adherencia clínica ni porcentaje
  del tiempo real transcurrido.

  <br /><br />

  Estos datos no sustituyen una evaluación profesional.

  <br /><br />

  CardioSync · Reporte generado a partir de los
  registros almacenados en el dispositivo.
</footer>

</div>
</body>
</html>
`
}
