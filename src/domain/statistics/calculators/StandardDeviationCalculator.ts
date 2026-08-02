import { AverageCalculator } from './AverageCalculator'

export class StandardDeviationCalculator {
  static calculate(values: number[]): number {
    if (values.length <= 1) {
      return 0
    }

    const mean = AverageCalculator.calculate(values)

    const variance =
      values.reduce((sum, value) => {
        const difference = value - mean
        return sum + difference * difference
      }, 0) / values.length

    return Math.sqrt(variance)
  }
}
