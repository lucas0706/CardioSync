export class TimeInTargetCalculator {
  static calculate(
    systolic: number[],
    diastolic: number[],
    targetSystolic = 135,
    targetDiastolic = 85,
  ): number {
    if (systolic.length === 0) return 0

    let inTarget = 0

    for (let i = 0; i < systolic.length; i++) {
      if (
        systolic[i] < targetSystolic &&
        diastolic[i] < targetDiastolic
      ) {
        inTarget++
      }
    }

    return (inTarget / systolic.length) * 100
  }
}
