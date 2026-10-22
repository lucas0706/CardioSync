import assert from 'node:assert/strict'
import test from 'node:test'

import { BloodPressureClassifier } from '../src/domain/clinical/classification/BloodPressureClassifier.ts'
import { StatisticsEngine } from '../src/domain/statistics/engines/StatisticsEngine.ts'
import { buildReportRedesignV1 } from '../src/features/reports/renderers/ReportRedesignV1.ts'

function makeRecord(index, systolic = 120, diastolic = 75) {
  const dateTime = new Date(Date.UTC(2026, 9, 20, 8, index)).toISOString()

  return {
    id: `measurement-${index}`,
    createdAt: dateTime,
    updatedAt: dateTime,
    dateTime,
    systolic,
    diastolic,
    heartRate: 68 + index,
  }
}

function makeReport(records, healthContext) {
  return {
    filter: { period: '30d' },
    patientName: 'Ana Ejemplo',
    summary: StatisticsEngine.summarize(records),
    records,
    healthContext,
  }
}

function makeHealthContext(seriesHasData = true) {
  const point = (value) => [{ date: '2026-10-20', value: seriesHasData ? value : null }]

  return {
    averageDailySteps30Days: 4000,
    averageHeartRate30Days: 70,
    averageSleepHours30Days: 6,
    exerciseMinutes30Days: 60,
    averageDailyExerciseMinutes30Days: 30,
    dailySteps30Days: point(6000),
    dailyHeartRate30Days: point(80),
    dailySleepHours30Days: point(8),
    dailyExerciseMinutes30Days: point(60),
  }
}

test('renders the six-column measurement table with complete rows and print pagination rules', () => {
  const records = Array.from({ length: 55 }, (_, index) => makeRecord(index))
  const html = buildReportRedesignV1(makeReport(records))
  const table = [...html.matchAll(/<table class="measurements-table">[\s\S]*?<\/table>/g)]
    .map((match) => match[0])
    .find((value) => value.includes('<th>Fecha</th>'))
  const headings = [...(table ?? '').matchAll(/<th(?:\s[^>]*)?>([\s\S]*?)<\/th>/g)].map((match) =>
    match[1].trim(),
  )

  assert.deepEqual(headings, ['Fecha', 'Hora', 'PAS', 'PAD', 'FC', 'Clasificación'])
  assert.equal((table?.match(/<tr class="row-/g) ?? []).length, records.length)
  assert.doesNotMatch(table ?? '', /<th[^>]*>Promedio<\/th>/i)
  assert.match(html, /Usuario: Ana Ejemplo/)
  assert.match(table ?? '', /classification-marker/)
  assert.match(table ?? '', /--classification-color: #16A34A;/)
  assert.match(html, /<col style="width: 18%;" \/>/)
  assert.match(html, /<col style="width: 11%;" \/>/)
  assert.match(html, /<col style="width: 38%;" \/>/)
  assert.match(
    html,
    /\.measurements-table th:last-child,\s*\.classification-cell \{\s*text-align: left;/,
  )
  assert.match(html, /th \{\s*padding: 9px 5px;\s*text-align: left;/)
  assert.match(
    html,
    /\.numeric-cell \{\s*text-align: center;\s*font-variant-numeric: tabular-nums;/,
  )
  assert.match(
    html,
    /\.measurements-table \.date-cell,\s*\.measurements-table \.time-cell \{\s*font-weight: 700;/,
  )
  assert.doesNotMatch(html, /\.measurements-table th:nth-child\(\d+\)[\s\S]*?text-align: right;/)
  assert.match(
    html,
    /\.measurements-table th:nth-child\(-n \+ 4\),\s*\.measurements-table td:nth-child\(-n \+ 4\) \{\s*border-right: 1px solid #CBD5E1;/,
  )
  assert.match(
    html,
    /\.measurements-table \.pressure-cell \{\s*padding-right: 10px;\s*padding-left: 10px;/,
  )
  assert.match(html, /table \{\s*width: 100%;\s*border-collapse: collapse;\s*font-size: 12px;/)
  assert.match(
    html,
    /td \{[\s\S]*?font-family:\s*"DMSans_400Regular",[\s\S]*?font-size: 11px;[\s\S]*?font-weight: 400;[\s\S]*?line-height: 14px;/,
  )
  assert.match(
    html,
    /\.measurements-table \.pressure-cell \{\s*color: #0F172A;\s*font-size: 18px;\s*font-weight: 700;\s*line-height: 20px;/,
  )
  assert.match(html, /\.measurements-table \.date-cell \{\s*padding-right: 10px;/)
  assert.match(
    html,
    /\.measurements-table \.classification-cell \{\s*font-size: 12px;\s*font-weight: 700;\s*line-height: normal;/,
  )
  assert.equal(
    (table?.match(/class="numeric-cell pressure-cell"/g) ?? []).length,
    records.length * 3,
  )
  assert.equal((table?.match(/class="numeric-cell"/g) ?? []).length, 0)
  assert.equal((table?.match(/class="(?:date-cell|time-cell)/g) ?? []).length, records.length * 2)
  assert.match(
    table ?? '',
    /<td class="classification-cell" style="color: #16A34A;">\s*Presión arterial normal\s*<\/td>/,
  )
  assert.doesNotMatch(table ?? '', /<td class="classification-cell"[^>]*>[\s\S]*?<span/)
  assert.doesNotMatch(table ?? '', /class="classification-(?:pill|badge)|⚠/)
  assert.match(html, /\.primary-value \{[\s\S]*?font-size: 26px;/)
  assert.match(html, /\.metric-value,\s*\.indicator-value \{[\s\S]*?font-size: 20px;/)
  assert.match(table ?? '', /Hipertensión arterial nivel 1|Presión arterial normal/)
  assert.match(html, /display: table-header-group/)
  assert.match(
    html,
    /\.measurements-table tr \{\s*break-inside: avoid;\s*page-break-inside: avoid;/,
  )
  assert.match(html, /\.measurements-section \{\s*break-inside: auto;/)
})

test('colors systolic and diastolic values using the existing History determining-pressure rules', () => {
  const cases = [
    {
      systolic: 120,
      diastolic: 75,
      color: '#16A34A',
      systolicDetermines: true,
      diastolicDetermines: true,
    },
    {
      systolic: 130,
      diastolic: 75,
      color: '#CA8A04',
      systolicDetermines: true,
      diastolicDetermines: false,
    },
    {
      systolic: 125,
      diastolic: 90,
      color: '#EA580C',
      systolicDetermines: false,
      diastolicDetermines: true,
    },
    {
      systolic: 160,
      diastolic: 80,
      color: '#DC2626',
      systolicDetermines: true,
      diastolicDetermines: false,
    },
    {
      systolic: 145,
      diastolic: 80,
      color: '#7C3AED',
      systolicDetermines: true,
      diastolicDetermines: true,
    },
  ]

  for (const [index, testCase] of cases.entries()) {
    const classification = BloodPressureClassifier.classify(testCase.systolic, testCase.diastolic)
    const html = buildReportRedesignV1(
      makeReport([makeRecord(index, testCase.systolic, testCase.diastolic)]),
    )
    const table = [...html.matchAll(/<table class="measurements-table">[\s\S]*?<\/table>/g)]
      .map((match) => match[0])
      .find((value) => value.includes('<th>Fecha</th>'))
    const row = table?.match(/<tr class="row-[\s\S]*?<\/tr>/)?.[0]
    const pressureCells = [
      ...(row?.matchAll(
        /<td\s+class="numeric-cell pressure-cell"\s+style="([^"]*)"\s*>([\s\S]*?)<\/td>/g,
      ) ?? []),
    ]

    assert.equal(classification.color, testCase.color)
    assert.equal(classification.determiningPressures.systolic, testCase.systolicDetermines)
    assert.equal(classification.determiningPressures.diastolic, testCase.diastolicDetermines)
    assert.deepEqual(
      pressureCells.map(([, style, value]) => [style, value.trim()]),
      [
        [testCase.systolicDetermines ? `color: ${testCase.color};` : '', String(testCase.systolic)],
        [
          testCase.diastolicDetermines ? `color: ${testCase.color};` : '',
          String(testCase.diastolic),
        ],
      ],
    )
  }
})

test('draws each Health Connect average from the displayed metric and colors only steps orange', () => {
  const html = buildReportRedesignV1(makeReport([makeRecord(0)], makeHealthContext()))
  const charts = [...html.matchAll(/<svg\s+class="health-chart"[\s\S]*?<\/svg>/g)].map(
    (match) => match[0],
  )

  assert.equal(charts.length, 4)
  assert.match(charts[0], /fill="#F97316"/)
  assert.match(charts[0], /stroke-dasharray="5 4"/)
  assert.match(charts[0], /y1="44\.33".*y2="44\.33"/)
  assert.match(charts[1], /stroke="#DC2626"/)
  assert.match(charts[1], /y1="89\.75".*y2="89\.75"/)
  assert.match(charts[2], /stroke="#7C3AED"/)
  assert.match(charts[2], /y1="35\.25".*y2="35\.25"/)
  assert.match(charts[3], /stroke="#16A34A"/)
  assert.match(charts[3], /y1="62\.50".*y2="62\.50"/)
  assert.doesNotMatch(charts[1] + charts[2] + charts[3], /fill="#F97316"/)
})

test('does not render empty Health Connect charts or zero-valued placeholder metrics', () => {
  const html = buildReportRedesignV1(makeReport([makeRecord(0)], makeHealthContext(false)))

  assert.match(html, /Sin datos disponibles de Health Connect/)
  assert.doesNotMatch(html, /class="health-chart"/)
  assert.doesNotMatch(html, /class="health-average-legend"/)
})

test('omits the average line when its indicator value is unavailable', () => {
  const healthContext = makeHealthContext()
  healthContext.averageHeartRate30Days = Number.NaN
  const html = buildReportRedesignV1(makeReport([makeRecord(0)], healthContext))
  const charts = [...html.matchAll(/<svg\s+class="health-chart"[\s\S]*?<\/svg>/g)].map(
    (match) => match[0],
  )

  assert.equal(charts.length, 4)
  assert.doesNotMatch(charts[1], /stroke-dasharray="5 4"/)
  assert.match(
    html,
    /<div class="indicator-label">Frecuencia cardíaca promedio<\/div>\s*<div class="indicator-value">—<\/div>/,
  )
})
