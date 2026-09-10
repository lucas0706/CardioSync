export class MeanArterialPressureCalculator {
  static calculate(
    systolic: number,
    diastolic: number,
  ): number {
    return diastolic + (systolic - diastolic) / 3
  }
}
