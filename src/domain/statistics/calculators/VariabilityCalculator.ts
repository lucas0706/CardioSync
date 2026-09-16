import { AverageCalculator } from './AverageCalculator'
import { StandardDeviationCalculator } from './StandardDeviationCalculator'

export class VariabilityCalculator {
  static calculate(values: number[]): number {
    if (values.length <= 1) {
      return 0
    }

    const average = AverageCalculator.calculate(values)

    if (average === 0) {
      return 0
    }

    const standardDeviation =
      StandardDeviationCalculator.calculate(values)

    return (standardDeviation / average) * 100
  }
}
