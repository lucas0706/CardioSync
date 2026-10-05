import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { BloodPressureClassifier } from '@/domain/clinical/classification'
import type { BloodPressureReport } from '@/features/reports/models/BloodPressureReport'
import type { ReportHealthTrendPoint } from '@/features/reports/models/ReportHealthContext'

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

function formatHoursMinutes(
  hours: number | undefined,
): string {
  if (
    hours === undefined ||
    !Number.isFinite(hours)
  ) {
    return '—'
  }

  const totalMinutes =
    Math.round(hours * 60)

  const hh =
    Math.floor(
      totalMinutes / 60,
    )

  const mm =
    totalMinutes % 60

  return `${hh} h ${mm} min`
}

type HealthChartMetric =
  | 'steps'
  | 'heartRate'
  | 'sleep'
  | 'exercise'

function getNiceAxisStep(
  rawStep: number,
): number {
  if (!Number.isFinite(rawStep) || rawStep <= 0) {
    return 1
  }

  const magnitude =
    10 ** Math.floor(Math.log10(rawStep))
  const fraction = rawStep / magnitude
  const niceFraction =
    fraction <= 1
      ? 1
      : fraction <= 2
        ? 2
        : fraction <= 2.5
          ? 2.5
          : fraction <= 5
            ? 5
            : 10

  return niceFraction * magnitude
}

function formatAxisValue(
  value: number,
  metric: HealthChartMetric,
): string {
  if (metric === 'sleep') {
    return `${Number(value.toFixed(1))} h`
  }

  return Math.round(value).toLocaleString('es-AR')
}

function buildHealthChart(
  series: ReportHealthTrendPoint[] | undefined,
  metric: HealthChartMetric,
  label: string,
): string {
  const values =
    series?.map((point) =>
      typeof point.value === 'number' &&
      Number.isFinite(point.value)
        ? point.value
        : null,
    ) ?? []

  const validValues =
    values.filter(
      (value): value is number =>
        value !== null,
    )

  if (validValues.length === 0) {
    return `
      <div
        class="health-chart-empty"
        role="img"
        aria-label="${escapeHtml(label)}: sin datos disponibles"
      >
        Sin datos disponibles
      </div>
    `
  }

  const width = 360
  const height = 142
  const left = 48
  const right = 5
  const top = 8
  const bottom = 25
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const minimum = Math.min(...validValues)
  const maximum = Math.max(...validValues)
  const isHeartRate = metric === 'heartRate'
  const minimumSpan =
    metric === 'heartRate'
      ? 40
      : metric === 'steps'
        ? 4000
        : metric === 'sleep'
          ? 4
          : 60
  const range = Math.max(maximum - minimum, minimumSpan, maximum * 0.05, 1)
  const step = getNiceAxisStep(range / 4)
  let axisMinimum =
    isHeartRate
      ? Math.floor((minimum - range * 0.05) / step) * step
      : 0
  let axisMaximum =
    Math.ceil(
      (maximum + (isHeartRate ? range * 0.05 : 0)) / step,
    ) * step

  if (isHeartRate && axisMaximum - axisMinimum < minimumSpan) {
    const midpoint = (minimum + maximum) / 2
    axisMinimum = Math.floor((midpoint - minimumSpan / 2) / step) * step
    axisMaximum = Math.ceil((midpoint + minimumSpan / 2) / step) * step
  }

  axisMinimum = Math.max(0, axisMinimum)
  const tickStep = getNiceAxisStep((axisMaximum - axisMinimum) / 4)
  axisMinimum = Math.floor(axisMinimum / tickStep) * tickStep
  axisMaximum = Math.ceil(axisMaximum / tickStep) * tickStep
  axisMaximum = Math.max(axisMaximum, axisMinimum + tickStep)
  const ticks: number[] = []

  for (
    let value = axisMinimum;
    value <= axisMaximum + tickStep * 0.001;
    value += tickStep
  ) {
    ticks.push(Number(value.toFixed(6)))
  }

  const yForValue = (value: number) =>
    top + ((axisMaximum - value) / (axisMaximum - axisMinimum)) * plotHeight
  const xForIndex = (index: number) =>
    left +
    (values.length <= 1 ? plotWidth / 2 : (index / (values.length - 1)) * plotWidth)
  const grid = ticks
    .map((value) => {
      const y = yForValue(value)

      return `
        <line
          x1="${left}"
          y1="${y.toFixed(2)}"
          x2="${(width - right).toFixed(2)}"
          y2="${y.toFixed(2)}"
          stroke="${value === axisMinimum ? '#94A3B8' : '#E2E8F0'}"
          stroke-width="${value === axisMinimum ? '1.2' : '0.8'}"
        />
        <text
          x="${left - 6}"
          y="${(y + 3.5).toFixed(2)}"
          text-anchor="end"
          class="health-chart-axis-label"
        >${escapeHtml(formatAxisValue(value, metric))}</text>
      `
    })
    .join('')
  const colors: Record<HealthChartMetric, string> = {
    steps: '#2563EB',
    heartRate: '#DC2626',
    sleep: '#7C3AED',
    exercise: '#16A34A',
  }
  const color = colors[metric]
  let segments: string[][] = []
  let currentSegment: string[] = []

  values.forEach((value, index) => {
    if (value === null) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment)
        currentSegment = []
      }

      return
    }

    const x = xForIndex(index)
    const y = yForValue(value)

    if (isHeartRate) {
      currentSegment.push(`${x.toFixed(2)},${y.toFixed(2)}`)
    } else {
      const slotWidth = plotWidth / Math.max(values.length, 1)
      const barWidth = Math.min(8, slotWidth * 0.62)
      const barHeight = Math.max(top + plotHeight - y, 0)
      currentSegment.push(
        `<rect x="${(x - barWidth / 2).toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" rx="1.2" />`,
      )
    }
  })

  if (currentSegment.length > 0) {
    segments.push(currentSegment)
  }

  const drawing = isHeartRate
    ? segments
        .filter((segment) => segment.length > 1)
        .map(
          (segment) =>
            `<polyline points="${segment.join(' ')}" />`,
        )
        .join('')
    : segments.flatMap((segment) => segment).join('')
  const points = isHeartRate
    ? segments
        .flatMap((segment) => segment)
        .map((point) => {
          const [cx, cy] = point.split(',')
          return `<circle cx="${cx}" cy="${cy}" r="2" />`
        })
        .join('')
    : ''
  const xTickIndexes = Array.from(
    new Set(
      [0, 5, 10, 15, 20, 25, values.length - 1].filter(
        (index) => index >= 0 && index < values.length,
      ),
    ),
  )
  const xLabels = xTickIndexes
    .map((index) => {
      const dateLabel = series?.[index]?.date.slice(8, 10) ?? ''
      return `
        <text
          x="${xForIndex(index).toFixed(2)}"
          y="${height - 6}"
          text-anchor="${
            index === 0
              ? 'start'
              : index === values.length - 1
                ? 'end'
                : 'middle'
          }"
          class="health-chart-axis-label"
        >${escapeHtml(String(Number(dateLabel)))}</text>
      `
    })
    .join('')

  return `
    <svg
      class="health-chart"
      viewBox="0 0 ${width} ${height}"
      preserveAspectRatio="none"
      role="img"
      aria-label="${escapeHtml(label)}: gráfico diario de los últimos 30 días"
    >
      ${grid}
      <line
        x1="${left}"
        y1="${(top + plotHeight).toFixed(2)}"
        x2="${width - right}"
        y2="${(top + plotHeight).toFixed(2)}"
        stroke="#64748B"
        stroke-width="1.2"
      />
      <g
        fill="${isHeartRate ? 'none' : color}"
        stroke="${color}"
        stroke-width="${isHeartRate ? '2.2' : '0'}"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        ${drawing}
      </g>
      <g fill="${color}">
        ${points}
      </g>
      <g fill="#64748B">
        ${xLabels}
      </g>
    </svg>
  `
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
  hasClinicalAlert: boolean
} {
  const classification =
    BloodPressureClassifier.classify(
      record.systolic,
      record.diastolic,
    )

  return {
    category: classification.category,
    label: classification.label,
    hasClinicalAlert:
      classification.safetyWarnings.length > 0,
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

function getClassificationColor(
  category: string,
): string | undefined {
  switch (category) {
    case 'normal':
    case 'borderline':
    case 'grade-1':
    case 'grade-2':
    case 'isolated-systolic':
      return BloodPressureClassifier.getClassification(category).color

    default:
      return undefined
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

  const maximumRecord =
    records.reduce((current, record) =>
      record.systolic > current.systolic
        ? record
        : current,
    )

  const minimumRecord =
    records.reduce((current, record) =>
      record.systolic < current.systolic
        ? record
        : current,
    )

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


  const extremeLabels = records
    .map((record, index) => {
      const labels: string[] = []

      if (
        record.id === maximumRecord.id
      ) {
        labels.push(`
          <circle
            cx="${getX(index)}"
            cy="${getY(record.systolic)}"
            r="6"
            class="point-highlight-high"
          />

          <text
            x="${getX(index)}"
            y="${getY(record.systolic) - 12}"
            text-anchor="middle"
            class="highlight-label-high"
          >
            ${record.systolic}/${record.diastolic}
          </text>
        `)
      }

      if (
        record.id === minimumRecord.id
      ) {
        labels.push(`
          <circle
            cx="${getX(index)}"
            cy="${getY(record.systolic)}"
            r="6"
            class="point-highlight-low"
          />

          <text
            x="${getX(index)}"
            y="${getY(record.systolic) + 20}"
            text-anchor="middle"
            class="highlight-label-low"
          >
            ${record.systolic}/${record.diastolic}
          </text>
        `)
      }

      return labels.join('')
    })
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
        ${extremeLabels}
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
      const color =
        getClassificationColor(classification)

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
              style="width: ${Math.min(percentage, 100).toFixed(1)}%${
                color ? `; background-color: ${color}` : ''
              }"
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
    .map((record, index) => {
      const classification =
        getRecordClassification(record)

      return `
        <tr class="${index % 2 === 0 ? 'row-light' : 'row-shaded'}">
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
              ${classification.hasClinicalAlert ? '⚠️ ' : ''}
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
  background: #EDF4FF;
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
  border: 1px solid #DBEAFE;
  border-radius: 18px;
}

.header {
  padding: 24px;
  margin-bottom: 16px;
}

.brand {
  color: #16A34A;
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
  background: #EDF4FF;
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

.metric-subvalue {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #687585;
}

.metric,
.indicator {
  padding: 11px;
  border-radius: 11px;
  background: #FFFFFF;
}

.health-chart {
  display: block;
  width: 100%;
  height: 142px;
  margin-top: 16px;
  overflow: hidden;
}

.health-chart-axis-label {
  fill: #64748B;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 10px;
}

.health-chart-empty {
  display: flex;
  align-items: center;
  height: 142px;
  margin-top: 16px;
  color: #8A94A3;
  font-size: 12px;
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
  background: #FFFFFF;
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
  background: #EFF6FF;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: #3B82F6;
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
  stroke: #DBEAFE;
  stroke-width: 1;
}

.chart-label {
  fill: #7a8491;
  font-size: 10px;
}

.line-systolic {
  stroke: #2563EB;
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
  fill: #2563EB;
}

.point-diastolic {
  fill: #718096;
}

.point-highlight-high {
  fill: #DC2626;
  stroke: #FFFFFF;
  stroke-width: 2;
}

.point-highlight-low {
  fill: #2563EB;
  stroke: #FFFFFF;
  stroke-width: 2;
}

.highlight-label-high {
  fill: #DC2626;
  font-size: 11px;
  font-weight: 700;
}

.highlight-label-low {
  fill: #2563EB;
  font-size: 11px;
  font-weight: 700;
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
  background: #2563EB;
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

.measurements-table tbody .row-light {
  background-color: #FFFFFF;
}

.measurements-table tbody .row-shaded {
  background-color: #F8FAFF;
}

th {
  padding: 9px 7px;
  text-align: left;
  color: #687585;
  font-weight: 650;
  border-bottom: 1px solid #DBEAFE;
}

td {
  padding: 9px 7px;
  border-bottom: 1px solid #F8FAFF;
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
  background: #EFF6FF;
  color: #16A34A;
}

.classification.borderline {
  background: #f6f0dd;
  color: #CA8A04;
}

.classification.grade1 {
  background: #fde4dc;
  color: #EA580C;
  font-weight: 750;
}

.classification.grade2 {
  background: #f8d2d2;
  color: #DC2626;
  font-weight: 750;
}

.classification.isolated-systolic {
  background: #eee5ff;
  color: #7C3AED;
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
  background: #FFFFFF;
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
        ${summary.maximumRecord
          ? `${summary.maximumRecord.systolic}/${summary.maximumRecord.diastolic}`
          : '--'}
        <span class="metric-unit">mmHg</span>

        ${
          summary.maximumRecord
            ? `<div class="metric-subvalue">
                ${formatDate(
                  summary.maximumRecord.dateTime,
                )}
              </div>`
            : ''
        }
      </div>
    </div>

    <div class="metric">
      <div class="metric-label">
        Valor mínimo
      </div>

      <div class="metric-value">
        ${summary.minimumRecord
          ? `${summary.minimumRecord.systolic}/${summary.minimumRecord.diastolic}`
          : '--'}
        <span class="metric-unit">mmHg</span>

        ${
          summary.minimumRecord
            ? `<div class="metric-subvalue">
                ${formatDate(
                  summary.minimumRecord.dateTime,
                )}
              </div>`
            : ''
        }
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
    <table class="measurements-table">
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

${
  report.healthContext
    ? `
<section class="section">
  <h2 class="section-title">
    Contexto fisiológico (últimos 30 días)
  </h2>

  <div class="indicator-grid">

    <div class="indicator">
      <div class="indicator-label">
        Pasos diarios promedio
      </div>

      <div class="indicator-value">
        ${
          report.healthContext
            ?.averageDailySteps30Days ?? '—'
        }
      </div>
      ${buildHealthChart(
        report.healthContext?.dailySteps30Days,
        'steps',
        'Pasos',
      )}
    </div>

    <div class="indicator">
      <div class="indicator-label">
        Frecuencia cardíaca promedio
      </div>

      <div class="indicator-value">
        ${
          report.healthContext
            ?.averageHeartRate30Days ?? '—'
        }
        lpm
      </div>
      ${buildHealthChart(
        report.healthContext?.dailyHeartRate30Days,
        'heartRate',
        'Frecuencia cardíaca',
      )}
    </div>

    <div class="indicator">
      <div class="indicator-label">
        Sueño promedio
      </div>

      <div class="indicator-value">
        ${
          report.healthContext
            ?.averageSleepHours30Days != null
            ? formatHoursMinutes(
                report.healthContext
                  .averageSleepHours30Days,
              )
            : '—'
        }
      </div>
      ${buildHealthChart(
        report.healthContext?.dailySleepHours30Days,
        'sleep',
        'Sueño',
      )}
    </div>

    <div class="indicator">
      <div class="indicator-label">
        Ejercicio promedio diario
      </div>

      <div class="indicator-value">
        ${
          report.healthContext
            ?.averageDailyExerciseMinutes30Days != null
            ? formatHoursMinutes(
                report.healthContext
                  .averageDailyExerciseMinutes30Days / 60,
              )
            : '—'
        }
      </div>
      <div class="indicator-label">
        por día con datos
      </div>
      ${buildHealthChart(
        report.healthContext?.dailyExerciseMinutes30Days,
        'exercise',
        'Ejercicio',
      )}
    </div>

  </div>
</section>

<div
  style="
    margin-top:16px;
    padding:12px;
    border:1px solid #e5e7eb;
    border-radius:8px;
    font-size:12px;
    line-height:1.5;
    color:#6b7280;
  "
>
  <strong>Fuente de datos:</strong>
  Información obtenida desde Health Connect.
  Los indicadores de pasos, frecuencia cardíaca,
  sueño y ejercicio son calculados por
  CardioSync a partir de los registros disponibles
  durante los últimos 30 días.
</div>
`
    : ''
}


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
