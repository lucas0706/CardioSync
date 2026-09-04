import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import {
  AdherenceCalculator,
  AverageCalculator,
  ClinicalClassificationCalculator,
  HypertensionLoadCalculator,
  MaxCalculator,
  MeanArterialPressureCalculator,
  MinCalculator,
  PulsePressureCalculator,
  StandardDeviationCalculator,
  TimeInTargetCalculator,
  TrendCalculator,
  VariabilityCalculator,
} from '../calculators'

import { PeriodFilter } from '../filters'
import { StatisticsAggregator } from '../services'
import type {
  StatisticsFilter,
  StatisticsSummary,
} from '../models'

export class StatisticsEngine {
  static summarize(
    records: BloodPressureRecord[],
    filter?: StatisticsFilter,
  ): StatisticsSummary {
    const filteredRecords = filter
      ? PeriodFilter.apply(records, filter)
      : records

    const chronologicalRecords =
      [...filteredRecords].sort(
        (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(),
      )

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
        averageHeartRate: 0,

        maximumSystolic: 0,
        maximumDiastolic: 0,

        minimumSystolic: 0,
        minimumDiastolic: 0,

        pulsePressureAverage: 0,
        meanArterialPressureAverage: 0,

        systolicStandardDeviation: 0,
        diastolicStandardDeviation: 0,

        systolicVariability: 0,
        diastolicVariability: 0,

        hypertensionLoad: 0,
        timeInTarget: 0,
        adherence: 0,

        trend: 'stable',

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

    return {
      totalMeasurements: filteredRecords.length,

      averageSystolic:
        AverageCalculator.calculate(systolic),

      averageDiastolic:
        AverageCalculator.calculate(diastolic),

      averageHeartRate:
        AverageCalculator.calculate(heartRate),

      maximumSystolic:
        MaxCalculator.calculate(systolic),

      maximumDiastolic:
        MaxCalculator.calculate(diastolic),

      minimumSystolic:
        MinCalculator.calculate(systolic),

      minimumDiastolic:
        MinCalculator.calculate(diastolic),

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

      trend:
        TrendCalculator.calculate(
          chronologicalRecords.map(
            record => record.systolic,
          ),
        ),

      predominantClassification:
        clinicalClassification.predominantClassification,

      classificationDistribution:
        clinicalClassification.classificationDistribution,
    }
  }
}
