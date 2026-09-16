import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { clinicalSeries } from '@/components/charts/ClinicalChart/constants/clinicalSeries'
import type { ClinicalSeriesKey } from '@/components/charts/ClinicalChart/types/ClinicalSeries'
import { buildChartData } from '@/components/charts/ClinicalChart/utils/buildChartData'

const REPORT_SERIES: ClinicalSeriesKey[] = [
  'systolic',
  'diastolic',
  'heartRate',
]

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getSeriesColor(
  key: ClinicalSeriesKey,
): string {
  return (
    clinicalSeries.find(
      item => item.key === key,
    )?.color ?? '#64748B'
  )
}

function getSeriesLabel(
  key: ClinicalSeriesKey,
): string {
  return (
    clinicalSeries.find(
      item => item.key === key,
    )?.label ?? key
  )
}

function getSeriesUnit(
  key: ClinicalSeriesKey,
): string {
  return (
    clinicalSeries.find(
      item => item.key === key,
    )?.unit ?? ''
  )
}

function getValue(
  record: ReturnType<typeof buildChartData>[number],
  key: ClinicalSeriesKey,
): number | undefined {
  const value = record[key]

  return typeof value === 'number' &&
    Number.isFinite(value)
    ? value
    : undefined
}

export function buildReportClinicalChart(
  records: BloodPressureRecord[],
): string {
  const data = buildChartData(records)

  if (data.length === 0) {
    return `
      <section class="chart-section">
        <h2>Evolución clínica</h2>
        <p class="empty">
          No hay registros suficientes para mostrar
          el gráfico.
        </p>
      </section>
    `
  }

  const width = 760
  const height = 340

  const paddingLeft = 54
  const paddingRight = 24
  const paddingTop = 34
  const paddingBottom = 48

  const chartWidth =
    width -
    paddingLeft -
    paddingRight

  const chartHeight =
    height -
    paddingTop -
    paddingBottom

  const values = data.flatMap(record =>
    REPORT_SERIES
      .map(key => getValue(record, key))
      .filter(
        (value): value is number =>
          value !== undefined,
      ),
  )

  if (values.length === 0) {
    return `
      <section class="chart-section">
        <h2>Evolución clínica</h2>
        <p class="empty">
          No hay valores disponibles para mostrar
          el gráfico.
        </p>
      </section>
    `
  }

  const dataMin = Math.min(...values)
  const dataMax = Math.max(...values)

  const minValue =
    Math.floor(
      Math.min(
        dataMin - 10,
        40,
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
    if (data.length === 1) {
      return (
        paddingLeft +
        chartWidth / 2
      )
    }

    return (
      paddingLeft +
      (index /
        (data.length - 1)) *
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
          stroke="#CBD5E1"
          stroke-width="1"
        />

        <text
          x="${paddingLeft - 8}"
          y="${(y + 3).toFixed(1)}"
          text-anchor="end"
          font-size="10"
          fill="#64748B"
        >
          ${value}
        </text>
      `
    })
    .join('')

  const labelStep =
    Math.max(
      1,
      Math.ceil(data.length / 6),
    )

  const xLabels = data
    .map((record, index) => {
      if (
        index % labelStep !== 0 &&
        index !== data.length - 1
      ) {
        return ''
      }

      const x = getX(index)
      const date = new Date(
        record.date,
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
          y="${height - 18}"
          text-anchor="middle"
          font-size="9"
          fill="#64748B"
        >
          ${label}
        </text>
      `
    })
    .join('')

  const seriesSvg =
    REPORT_SERIES
      .map(key => {
        const points = data
          .map((record, index) => {
            const value = getValue(
              record,
              key,
            )

            if (value === undefined) {
              return null
            }

            return {
              x: getX(index),
              y: getY(value),
            }
          })
          .filter(
            (
              point,
            ): point is {
              x: number
              y: number
            } => point !== null,
          )

        if (points.length === 0) {
          return ''
        }

        const color =
          getSeriesColor(key)

        const polyline = points
          .map(
            point =>
              `${point.x.toFixed(1)},${point.y.toFixed(1)}`,
          )
          .join(' ')

        const markers = points
          .map(
            point => `
              <circle
                cx="${point.x.toFixed(1)}"
                cy="${point.y.toFixed(1)}"
                r="3.5"
                fill="${color}"
              />
            `,
          )
          .join('')

        return `
          <polyline
            points="${polyline}"
            fill="none"
            stroke="${color}"
            stroke-width="2.5"
            stroke-linejoin="round"
            stroke-linecap="round"
          />

          ${markers}
        `
      })
      .join('')

  const legend = REPORT_SERIES
    .map(key => {
      const color =
        getSeriesColor(key)

      const label =
        escapeHtml(
          getSeriesLabel(key),
        )

      const unit =
        escapeHtml(
          getSeriesUnit(key),
        )

      return `
        <div class="clinical-chart-legend-item">
          <span
            class="clinical-chart-legend-line"
            style="background-color: ${color};"
          ></span>

          <span>
            ${label}
            <span class="clinical-chart-legend-unit">
              (${unit})
            </span>
          </span>
        </div>
      `
    })
    .join('')

  return `
    <section class="chart-section">
      <h2>Evolución clínica</h2>

      <div class="chart-card">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 ${width} ${height}"
          width="100%"
          height="${height}"
          role="img"
          aria-label="Evolución de presión sistólica, presión diastólica y frecuencia cardíaca"
        >
          ${yGrid}

          ${seriesSvg}

          ${xLabels}

          <line
            x1="${paddingLeft}"
            y1="${paddingTop}"
            x2="${paddingLeft}"
            y2="${(
              height - paddingBottom
            ).toFixed(1)}"
            stroke="#94A3B8"
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
            stroke="#94A3B8"
            stroke-width="1"
          />
        </svg>
      </div>

      <div class="clinical-chart-legend">
        ${legend}
      </div>

      <p class="chart-note">
        Evolución temporal de los valores registrados
        durante el período seleccionado.
      </p>
    </section>
  `
}
