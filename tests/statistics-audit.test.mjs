import assert from 'node:assert/strict'
import test from 'node:test'

import { buildReportRedesignV1 as buildReportPreview } from '../src/devtools/reports/ReportRedesignV1.ts'
import { AdherenceCalculator } from '../src/domain/statistics/calculators/AdherenceCalculator.ts'
import { StatisticsEngine } from '../src/domain/statistics/engines/StatisticsEngine.ts'
import { PeriodFilter } from '../src/domain/statistics/filters/PeriodFilter.ts'
import { StatisticsDomainService } from '../src/domain/statistics/services/StatisticsDomainService.ts'
import { buildReportRedesignV1 } from '../src/features/reports/renderers/ReportRedesignV1.ts'
import { ReportHtmlService } from '../src/features/reports/services/ReportHtmlService.ts'

function makeRecord({ id, dateTime, systolic, diastolic, heartRate }) {
  return {
    id,
    createdAt: dateTime,
    updatedAt: dateTime,
    dateTime,
    systolic,
    diastolic,
    ...(heartRate === undefined ? {} : { heartRate }),
  }
}

function makeExtremaRecords() {
  return [
    makeRecord({
      id: 'high-diastolic',
      dateTime: '2026-10-14T08:00:00',
      systolic: 126,
      diastolic: 87,
    }),
    makeRecord({
      id: 'later-high-diastolic',
      dateTime: '2026-10-15T08:00:00',
      systolic: 125,
      diastolic: 87,
    }),
    makeRecord({
      id: 'later-systolic',
      dateTime: '2026-10-20T08:00:00',
      systolic: 128,
      diastolic: 79,
    }),
    makeRecord({
      id: 'z-tie',
      dateTime: '2026-10-20T07:00:00',
      systolic: 128,
      diastolic: 77,
    }),
    makeRecord({
      id: 'a-tie',
      dateTime: '2026-10-20T07:00:00',
      systolic: 128,
      diastolic: 78,
    }),
    makeRecord({
      id: 'earlier-minimum',
      dateTime: '2026-10-17T10:00:00',
      systolic: 100,
      diastolic: 65,
    }),
    makeRecord({
      id: 'later-minimum',
      dateTime: '2026-10-18T09:00:00',
      systolic: 100,
      diastolic: 64,
    }),
    makeRecord({
      id: 'low-diastolic',
      dateTime: '2026-10-18T06:00:00',
      systolic: 110,
      diastolic: 60,
    }),
    makeRecord({
      id: 'later-low-diastolic',
      dateTime: '2026-10-19T06:00:00',
      systolic: 115,
      diastolic: 60,
    }),
  ]
}

function reportFor(records, summary, healthContext) {
  return {
    filter: { period: '30d' },
    summary,
    records,
    healthContext,
  }
}

function assertClose(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`)
}

test('calculates each blood-pressure extreme independently and resolves ties deterministically', () => {
  const records = makeExtremaRecords()
  const summary = StatisticsEngine.summarize(records)
  const reversedSummary = StatisticsEngine.summarize([...records].reverse())

  assert.equal(summary.maximumSystolic, 128)
  assert.equal(summary.maximumSystolicRecord.id, 'a-tie')
  assert.equal(summary.maximumDiastolic, 87)
  assert.equal(summary.maximumDiastolicRecord.id, 'high-diastolic')
  assert.equal(summary.minimumSystolic, 100)
  assert.equal(summary.minimumSystolicRecord.id, 'earlier-minimum')
  assert.equal(summary.minimumDiastolic, 60)
  assert.equal(summary.minimumDiastolicRecord.id, 'low-diastolic')

  assert.equal(summary.maximumRecord, summary.maximumSystolicRecord)
  assert.equal(summary.minimumRecord, summary.minimumSystolicRecord)
  assert.equal(reversedSummary.maximumSystolicRecord.id, 'a-tie')
  assert.equal(reversedSummary.maximumDiastolicRecord.id, 'high-diastolic')
  assert.equal(reversedSummary.minimumSystolicRecord.id, 'earlier-minimum')
  assert.equal(reversedSummary.minimumDiastolicRecord.id, 'low-diastolic')
})

test('returns unavailable extrema and regularity for empty and one-record periods', () => {
  const empty = StatisticsEngine.summarize([])
  assert.equal(empty.maximumSystolic, undefined)
  assert.equal(empty.maximumDiastolic, undefined)
  assert.equal(empty.minimumSystolic, undefined)
  assert.equal(empty.minimumDiastolic, undefined)
  assert.equal(empty.maximumSystolicRecord, undefined)
  assert.equal(empty.minimumDiastolicRecord, undefined)
  assert.equal(empty.averageHeartRate, undefined)
  assert.equal(empty.adherence, undefined)

  const only = makeRecord({
    id: 'one',
    dateTime: '2026-10-20T10:00:00',
    systolic: 120,
    diastolic: 80,
  })
  const single = StatisticsEngine.summarize([only])
  assert.equal(single.maximumSystolicRecord, only)
  assert.equal(single.maximumDiastolicRecord, only)
  assert.equal(single.minimumSystolicRecord, only)
  assert.equal(single.minimumDiastolicRecord, only)
  assert.equal(single.adherence, undefined)
})

test('ignores invalid dates for regularity and uses a valid date for tied extrema when available', () => {
  const valid = makeRecord({
    id: 'valid',
    dateTime: '2026-10-20T10:00:00',
    systolic: 120,
    diastolic: 80,
  })
  const invalid = makeRecord({
    id: 'invalid',
    dateTime: 'not-a-date',
    systolic: 120,
    diastolic: 80,
  })

  assert.equal(StatisticsEngine.summarize([invalid, valid]).maximumSystolicRecord, valid)
  assert.equal(AdherenceCalculator.calculate([invalid, valid]), undefined)

  const nextDay = makeRecord({
    id: 'next-day',
    dateTime: '2026-10-21T10:00:00',
    systolic: 121,
    diastolic: 81,
  })
  assert.equal(AdherenceCalculator.calculate([nextDay, invalid, valid]), 100)
})

test('custom date filters include the final local date across a daylight-saving transition', () => {
  const records = [
    makeRecord({
      id: 'last-moment',
      dateTime: '2026-11-01T23:59:59.999',
      systolic: 120,
      diastolic: 80,
    }),
    makeRecord({
      id: 'next-day',
      dateTime: '2026-11-02T00:00:00',
      systolic: 120,
      diastolic: 80,
    }),
  ]
  const filtered = PeriodFilter.apply(records, {
    period: 'custom',
    startDate: new Date(2026, 10, 1),
    endDate: new Date(2026, 10, 1),
  })

  assert.deepEqual(
    filtered.map((record) => record.id),
    ['last-moment'],
  )
})

test('regularity is the share of adjacent valid chronological intervals no longer than 48 hours', () => {
  const within48h = [
    makeRecord({
      id: 'later',
      dateTime: '2026-10-03T00:00:00',
      systolic: 120,
      diastolic: 80,
    }),
    makeRecord({
      id: 'earlier',
      dateTime: '2026-10-01T00:00:00',
      systolic: 120,
      diastolic: 80,
    }),
  ]
  assert.equal(AdherenceCalculator.calculate(within48h), 100)

  const beyond48h = [
    ...within48h,
    makeRecord({
      id: 'third',
      dateTime: '2026-10-06T00:00:01',
      systolic: 120,
      diastolic: 80,
    }),
  ]
  assert.equal(AdherenceCalculator.calculate(beyond48h), 50)
})

test('averages use their valid measurement populations, including finite heart rates only', () => {
  const records = [
    makeRecord({
      id: 'a',
      dateTime: '2026-10-01T08:00:00',
      systolic: 130,
      diastolic: 80,
      heartRate: 80,
    }),
    makeRecord({
      id: 'b',
      dateTime: '2026-10-02T08:00:00',
      systolic: 150,
      diastolic: 90,
    }),
    makeRecord({
      id: 'c',
      dateTime: '2026-10-03T08:00:00',
      systolic: 120,
      diastolic: 70,
      heartRate: 100,
    }),
    makeRecord({
      id: 'd',
      dateTime: '2026-10-04T08:00:00',
      systolic: 140,
      diastolic: 80,
      heartRate: Number.NaN,
    }),
  ]
  const summary = StatisticsEngine.summarize(records)

  assertClose(summary.averageSystolic, 135)
  assertClose(summary.averageDiastolic, 80)
  assertClose(summary.averageHeartRate, 90)
  assertClose(summary.meanArterialPressureAverage, 98.33333333333333)
  assertClose(summary.pulsePressureAverage, 55)
})

test('excludes non-finite blood-pressure values from the shared statistical and report record set', () => {
  const valid = makeRecord({
    id: 'valid',
    dateTime: '2026-10-01T08:00:00',
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
  })
  const invalidSystolic = makeRecord({
    id: 'invalid-systolic',
    dateTime: '2026-10-02T08:00:00',
    systolic: Number.NaN,
    diastolic: 85,
  })
  const invalidDiastolic = makeRecord({
    id: 'invalid-diastolic',
    dateTime: '2026-10-03T08:00:00',
    systolic: 135,
    diastolic: Number.POSITIVE_INFINITY,
  })
  const records = [valid, invalidSystolic, invalidDiastolic]
  const summary = StatisticsEngine.summarize(records)
  const reportRecords = StatisticsDomainService.getFilteredRecords(records)

  assert.deepEqual(reportRecords, [valid])
  assert.equal(summary.totalMeasurements, reportRecords.length)
  assert.equal(
    Object.values(summary.classificationDistribution).reduce((sum, count) => sum + count, 0),
    reportRecords.length,
  )
  assert.equal(summary.averageSystolic, 120)
  assert.equal(summary.averageDiastolic, 80)
  assert.equal(summary.timeInTarget, 100)
  assert.equal(summary.hypertensionLoad, 0)
})

test('custom date filters include the whole end date and exclude adjacent dates', () => {
  const records = [
    makeRecord({
      id: 'before',
      dateTime: '2026-10-13T23:59:59.999',
      systolic: 120,
      diastolic: 80,
    }),
    makeRecord({
      id: 'start',
      dateTime: '2026-10-14T00:00:00',
      systolic: 120,
      diastolic: 80,
    }),
    makeRecord({
      id: 'end',
      dateTime: '2026-10-20T23:59:59.999',
      systolic: 120,
      diastolic: 80,
    }),
    makeRecord({
      id: 'after',
      dateTime: '2026-10-21T00:00:00',
      systolic: 120,
      diastolic: 80,
    }),
  ]
  const filtered = PeriodFilter.apply(records, {
    period: 'custom',
    startDate: new Date(2026, 9, 14),
    endDate: new Date(2026, 9, 20),
  })

  assert.deepEqual(
    filtered.map((record) => record.id),
    ['start', 'end'],
  )
  assert.deepEqual(
    StatisticsDomainService.getFilteredRecords(records, {
      period: 'custom',
      startDate: new Date(2026, 9, 14),
      endDate: new Date(2026, 9, 20),
    }),
    filtered,
  )
  assert.equal(
    StatisticsEngine.summarize(records, {
      period: 'custom',
      startDate: new Date(2026, 9, 14),
      endDate: new Date(2026, 9, 20),
    }).totalMeasurements,
    filtered.length,
  )
})

test('classification counts and 135/85 indicators use the same filtered records', () => {
  const records = [
    makeRecord({
      id: 'below',
      dateTime: '2026-10-01T08:00:00',
      systolic: 134,
      diastolic: 84,
    }),
    makeRecord({
      id: 'systolic-limit',
      dateTime: '2026-10-02T08:00:00',
      systolic: 135,
      diastolic: 80,
    }),
    makeRecord({
      id: 'diastolic-limit',
      dateTime: '2026-10-03T08:00:00',
      systolic: 134,
      diastolic: 85,
    }),
    makeRecord({
      id: 'both-limits',
      dateTime: '2026-10-04T08:00:00',
      systolic: 135,
      diastolic: 85,
    }),
  ]
  const summary = StatisticsEngine.summarize(records)
  const classificationCount = Object.values(summary.classificationDistribution).reduce(
    (sum, count) => sum + count,
    0,
  )
  const classificationPercent = Object.values(summary.classificationDistribution).reduce(
    (sum, count) => sum + (count / summary.totalMeasurements) * 100,
    0,
  )

  assert.equal(summary.totalMeasurements, records.length)
  assert.equal(classificationCount, records.length)
  assertClose(classificationPercent, 100)
  assert.equal(summary.timeInTarget, 25)
  assert.equal(summary.hypertensionLoad, 75)
  assert.equal(summary.timeInTarget + summary.hypertensionLoad, 100)

  const reportHtml = buildReportRedesignV1(reportFor(records, summary))
  const roundedPercentages = [
    ...reportHtml.matchAll(/class="classification-percent">\s*(\d+)%/g),
  ].map((match) => Number(match[1]))
  const roundedTotal = roundedPercentages.reduce((sum, percentage) => sum + percentage, 0)

  assert.ok(roundedTotal >= 97 && roundedTotal <= 103)
})

test('production PDF HTML and development preview preserve the pressure trend chart and independent extrema', () => {
  const records = makeExtremaRecords()
  const summary = StatisticsEngine.summarize(records)
  const report = reportFor(records, summary, {
    averageHeartRate30Days: 70,
    averageDailySteps30Days: 5000,
    averageSleepHours30Days: 7,
    exerciseMinutes30Days: 120,
    averageDailyExerciseMinutes30Days: 20,
    dailySteps30Days: [{ date: '2026-10-20', value: 5000 }],
    dailyHeartRate30Days: [{ date: '2026-10-20', value: 70 }],
    dailySleepHours30Days: [{ date: '2026-10-20', value: 7 }],
    dailyExerciseMinutes30Days: [{ date: '2026-10-20', value: 20 }],
  })

  for (const html of [ReportHtmlService.build(report), buildReportPreview(report)]) {
    assert.match(html, /Evolución de la presión/)
    assert.match(html, /class="line-systolic"/)
    assert.match(html, /class="line-diastolic"/)
    assert.match(html, /class="health-chart"/)
    assert.match(html, /Máxima sistólica \(PAS\)/)
    assert.match(html, /Máxima diastólica \(PAD\)/)
    assert.match(html, /87/)
    assert.match(html, /14\/10\/2026/)
  }

  const emptyHtml = ReportHtmlService.build(reportFor([], StatisticsEngine.summarize([])))
  assert.match(emptyHtml, /No hay mediciones para mostrar/)
  assert.match(emptyHtml, /No disponible/)
  assert.doesNotMatch(emptyHtml, /0\/0/)
})
