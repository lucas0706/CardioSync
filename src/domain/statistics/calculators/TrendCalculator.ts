export type TrendDirection =
  | 'up'
  | 'down'
  | 'stable'

export class TrendCalculator {
  static calculate(
    values: number[],
  ): TrendDirection {
    if (values.length < 2) {
      return 'stable'
    }

    const difference =
      values[values.length - 1] - values[0]

    if (difference > 3) {
      return 'up'
    }

    if (difference < -3) {
      return 'down'
    }

    return 'stable'
  }
}
