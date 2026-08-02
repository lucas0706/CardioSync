export class PulsePressureCalculator {
  static calculate(
    systolic: number,
    diastolic: number,
  ): number {
    return systolic - diastolic
  }
}
