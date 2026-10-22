import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import {
  AdherenceCalculator,
  AverageCalculator,
  ClinicalClassificationCalculator,
  HypertensionLoadCalculator,
  MeanArterialPressureCalculator,
  PulsePressureCalculator,
  StandardDeviationCalculator,
  TimeInTargetCalculator,
  VariabilityCalculator,
} from '../calculators'

import {
  PeriodFilter,
  ValidBloodPressureFilter,
} from '../filters'
import { StatisticsAggregator } from '../services'
import type {
  StatisticsFilter,
  StatisticsSummary,
} from '../models'

function compareRecordDateAndId(
  left: BloodPressureRecord,
  right: BloodPressureRecord,
): number {
  const leftTime = Date.parse(left.dateTime)
  const rightTime = Date.parse(right.dateTime)
  const leftHasValidDate = Number.isFinite(leftTime)
  const rightHasValidDate = Number.isFinite(rightTime)

  if (leftHasValidDate && rightHasValidDate && leftTime !== rightTime) {
    return leftTime - rightTime
  }

  if (leftHasValidDate !== rightHasValidDate) {
    return leftHasValidDate ? -1 : 1
  }

  return left.id.localeCompare(right.id)
}

function selectExtremeRecord(
  records: BloodPressureRecord[],
  pressure: 'systolic' | 'diastolic',
  direction: 'maximum' | 'minimum',
): BloodPressureRecord | undefined {
  let selected: BloodPressureRecord | undefined

  for (const record of records) {
    const value = record[pressure]

    if (!Number.isFinite(value)) {
      continue
    }

    if (!selected) {
      selected = record
      continue
    }

    const selectedValue = selected[pressure]
    const isMoreExtreme =
      direction === 'maximum'
        ? value > selectedValue
        : value < selectedValue

    if (
      isMoreExtreme ||
      (value === selectedValue &&
        compareRecordDateAndId(record, selected) < 0)
    ) {
      selected = record
    }
  }

  return selected
}

export class StatisticsEngine {
  static summarize(
    records: BloodPressureRecord[],
    filter?: StatisticsFilter,
  ): StatisticsSummary {
    const periodRecords = filter
      ? PeriodFilter.apply(records, filter)
      : records
    const filteredRecords =
      ValidBloodPressureFilter.apply(periodRecords)

    const metrics =
      StatisticsAggregator.aggregate(
        filteredRecords,
      )

    const clinicalClassification =
      ClinicalClassificationCalculator.calculate(
        filteredRecords,
      )

    if (filteredRecords.length === 0) {
      return {
        totalMeasurements: 0,

        averageSystolic: 0,
        averageDiastolic: 0,
        averageHeartRate: undefined,

        maximumSystolic: undefined,
        maximumDiastolic: undefined,

        minimumSystolic: undefined,
        minimumDiastolic: undefined,

        pulsePressureAverage: 0,
        meanArterialPressureAverage: 0,

        systolicStandardDeviation: 0,
        diastolicStandardDeviation: 0,

        systolicVariability: 0,
        diastolicVariability: 0,

        hypertensionLoad: 0,
        timeInTarget: 0,
        adherence: undefined,


        predominantClassification:
          clinicalClassification.predominantClassification,

        classificationDistribution:
          clinicalClassification.classificationDistribution,
      }
    }

    const systolic = metrics.systolic
    const diastolic = metrics.diastolic
    const heartRate = metrics.heartRate
    const pulsePressure = metrics.pulsePressure
    const mapValues = metrics.meanArterialPressure

    const maximumSystolicRecord =
      selectExtremeRecord(filteredRecords, 'systolic', 'maximum')
    const maximumDiastolicRecord =
      selectExtremeRecord(filteredRecords, 'diastolic', 'maximum')
    const minimumSystolicRecord =
      selectExtremeRecord(filteredRecords, 'systolic', 'minimum')
    const minimumDiastolicRecord =
      selectExtremeRecord(filteredRecords, 'diastolic', 'minimum')

    return {
      totalMeasurements: filteredRecords.length,

      averageSystolic:
        AverageCalculator.calculate(systolic),

      averageDiastolic:
        AverageCalculator.calculate(diastolic),

      averageHeartRate:
        heartRate.length > 0
          ? AverageCalculator.calculate(heartRate)
          : undefined,

      maximumSystolic:
        maximumSystolicRecord?.systolic,

      maximumDiastolic:
        maximumDiastolicRecord?.diastolic,

      minimumSystolic:
        minimumSystolicRecord?.systolic,

      minimumDiastolic:
        minimumDiastolicRecord?.diastolic,

      maximumRecord: maximumSystolicRecord,

      minimumRecord: minimumSystolicRecord,
      maximumSystolicRecord,
      maximumDiastolicRecord,
      minimumSystolicRecord,
      minimumDiastolicRecord,

      pulsePressureAverage:
        AverageCalculator.calculate(pulsePressure),

      meanArterialPressureAverage:
        AverageCalculator.calculate(mapValues),

      systolicStandardDeviation:
        StandardDeviationCalculator.calculate(systolic),

      diastolicStandardDeviation:
        StandardDeviationCalculator.calculate(diastolic),

      systolicVariability:
        VariabilityCalculator.calculate(systolic),

      diastolicVariability:
        VariabilityCalculator.calculate(diastolic),

      hypertensionLoad:
        HypertensionLoadCalculator.calculate(
          systolic,
          diastolic,
        ),

      timeInTarget:
        TimeInTargetCalculator.calculate(
          systolic,
          diastolic,
        ),

      adherence:
        AdherenceCalculator.calculate(
          filteredRecords,
        ),
      predominantClassification:
        clinicalClassification.predominantClassification,

      classificationDistribution:
        clinicalClassification.classificationDistribution,
    }
  }
}
