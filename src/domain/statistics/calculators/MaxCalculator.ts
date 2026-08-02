export class MaxCalculator {
  static calculate(values: number[]): number {
    if (values.length === 0) {
      return 0
    }

    return Math.max(...values)
  }
}
