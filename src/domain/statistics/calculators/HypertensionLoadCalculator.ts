export class HypertensionLoadCalculator {
  static calculate(
    systolic: number[],
    diastolic: number[],
    targetSystolic = 135,
    targetDiastolic = 85,
  ): number {
    if (systolic.length === 0) return 0

    let elevated = 0

    for (let i = 0; i < systolic.length; i++) {
      if (
        systolic[i] >= targetSystolic ||
        diastolic[i] >= targetDiastolic
      ) {
        elevated++
      }
    }

    return (elevated / systolic.length) * 100
  }
}
